const API_URL = 'https://ai-credit-score.onrender.com/';
import { getActiveGoalsCount } from '../db/budget-manager-sqlite';

let updateInterval = null;
const subscribers = new Set();

export const predictCreditScore = async (userData) => {
  try {
    // Get active goals count to factor into credit score
    const activeGoals = await getActiveGoalsCount();
    
    const response = await fetch(`${API_URL}/predict_credit_score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        income: userData.income || 0,
        savings: userData.savings || 0,
        existing_loans: userData.existing_loans || 0,
        employment_status: userData.employment_status || 0,
        expenses: userData.expenses || 0,
        financial_goals: activeGoals || userData.financial_goals || 0,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch credit score');
    }

    const data = await response.json();
    console.log('Active goals count:', activeGoals); // Debug log
    return Math.round(data.credit_score);
  } catch (error) {
    console.error('Error predicting credit score:', error);
    return null;
  }
};

// Mock data for testing or when API is unavailable
export const getMockUserData = () => ({
  income: 75000,
  savings: 2000,
  existing_loans: 1,
  employment_status: 0, // 1 for employed
  expenses: 2500,
  financial_goals: 1,
});

// Function to start periodic updates
export const startPeriodicUpdates = (callback, userData = getMockUserData()) => {
  // Add callback to subscribers
  subscribers.add(callback);

  // If interval is not already running, start it
  if (!updateInterval) {
    // Initial fetch
    fetchAndNotifySubscribers(userData);

    // Set up interval for subsequent fetches
    updateInterval = setInterval(() => {
      fetchAndNotifySubscribers(userData);
    }, 60000); // 60000 ms = 1 minute
  }

  // Return cleanup function
  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0 && updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  };
};

// Helper function to fetch and notify all subscribers
const fetchAndNotifySubscribers = async (userData) => {
  const score = await predictCreditScore(userData);
  if (score !== null) {
    console.log('Credit score updated:', score, 'at', new Date().toLocaleTimeString());
    subscribers.forEach(callback => callback(score));
  }
};

// Add a function to check time until next update
export const getTimeUntilNextUpdate = () => {
  if (!updateInterval) return null;
  
  // Get the time remaining in the current interval
  const now = new Date().getTime();
  const nextUpdate = Math.ceil(now / 60000) * 60000;
  return nextUpdate - now;
};

const API_URL = 'https://ai-credit-score.onrender.com/';  // Base URL

/**
 * Predicts loan feasibility using the ML model API
 * @param {Object} data - The loan application data
 * @returns {Promise<{ success: boolean, decision_rating?: number, error?: string }>}
 */
export async function predictLoanFeasibility(data) {
  try {
    // Convert all values to numbers and maintain order as expected by the API
    const orderedData = [
      Number(data.credit_score),
      Number(data.amount),
      Number(data.interest_rate),
      Number(data.tenure),
      Number(data.income),
      Number(data.savings),
      Number(data.existing_loans),
      Number(data.employment_status),
      Number(data.expenses),
      Number(data.financial_goals)
    ];

    console.log('Sending data to ML model:', {
      data: orderedData,
      shape: orderedData.length
    });

    const response = await fetch(`${API_URL}/rate_decision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        // Send as an array since your Flask API expects to reshape the data
        feature_vector: orderedData
      })
    });

    // Log the raw response for debugging
    const responseText = await response.text();
    console.log('Raw API response:', responseText);

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      } catch (e) {
        throw new Error(`Server error (${response.status}): ${responseText.slice(0, 100)}`);
      }
    }

    try {
      const result = JSON.parse(responseText);
      console.log('ML model prediction result:', result);

      if (result.decision_rating !== undefined) {
        return {
          success: true,
          decision_rating: result.decision_rating
        };
      } else {
        throw new Error('Response missing decision_rating');
      }
    } catch (e) {
      throw new Error(`Invalid JSON response: ${e.message}`);
    }
  } catch (error) {
    console.error('Error predicting loan feasibility:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Validates the input data before sending to the API
 * @param {Object} data - The loan application data
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateLoanData(data) {
  const errors = {};

  // Required fields matching API expectations
  const required_keys = [
    "credit_score", "amount", "interest_rate", "tenure",
    "income", "savings", "existing_loans", "employment_status", 
    "expenses", "financial_goals"
  ];

  // Check for missing fields
  required_keys.forEach(key => {
    if (data[key] === undefined || data[key] === null || data[key] === '') {
      errors[key] = `${key.replace('_', ' ')} is required`;
    }
  });

  // Type and range validations
  if (data.credit_score && (data.credit_score < 300 || data.credit_score > 900)) {
    errors.credit_score = 'Credit score must be between 300 and 900';
  }

  if (data.amount && data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (data.interest_rate && (data.interest_rate <= 0 || data.interest_rate > 100)) {
    errors.interest_rate = 'Interest rate must be between 0 and 100';
  }

  if (data.tenure && data.tenure <= 0) {
    errors.tenure = 'Tenure must be greater than 0';
  }

  if (data.income && data.income <= 0) {
    errors.income = 'Income must be greater than 0';
  }

  if (data.savings && data.savings < 0) {
    errors.savings = 'Savings cannot be negative';
  }

  if (data.existing_loans && data.existing_loans < 0) {
    errors.existing_loans = 'Number of existing loans cannot be negative';
  }

  if (data.employment_status !== 0 && data.employment_status !== 1) {
    errors.employment_status = 'Employment status must be 0 or 1';
  }

  if (data.expenses && data.expenses < 0) {
    errors.expenses = 'Expenses cannot be negative';
  }

  if (data.financial_goals && (data.financial_goals < 1 || data.financial_goals > 10)) {
    errors.financial_goals = 'Financial goals must be between 1 and 10';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Example usage:
// const testData = {
//   credit_score: 750,
//   amount: 500000,
//   interest_rate: 8.5,
//   tenure: 36,
//   income: 50000,
//   savings: 100000,
//   existing_loans: 1,
//   employment_status: 1,
//   expenses: 20000,
//   financial_goals: 8
// };
//
// predictLoanFeasibility(testData)
//   .then(result => {
//     if (result.success) {
//       console.log('Loan feasibility score:', result.decision_rating);
//     } else {
//       console.error('Error:', result.error);
//     }
//   });

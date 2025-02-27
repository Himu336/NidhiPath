import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

let db;

async function openDatabase() {
  db = await SQLite.openDatabaseAsync('budgetManager.db');
  await createTable();
}

async function createTable() {
  if (!db) return;
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        item TEXT NOT NULL, 
        targetAmount REAL NOT NULL,
        savedAmount REAL DEFAULT 0,
        frequency TEXT NOT NULL,
        planAmount REAL NOT NULL,
        duration TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        completedAt TEXT
      );
    `);
    console.log('Table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}

// Initialize database
openDatabase().catch(error => {
  console.error('Error initializing database:', error);
});

// CRUD operations for goals
export async function saveGoal(goal) {
  if (!db) throw new Error('Database not initialized');
  try {
    const result = await db.runAsync(
      'INSERT INTO goals (item, targetAmount, frequency, planAmount, duration) VALUES (?, ?, ?, ?, ?)',
      [goal.item, goal.amount, goal.plan.frequency, goal.plan.amount, goal.plan.duration]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error saving goal:', error);
    throw error;
  }
}

export async function getGoals() {
  if (!db) throw new Error('Database not initialized');
  try {
    return await db.getAllAsync('SELECT * FROM goals ORDER BY createdAt DESC');
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
}

export async function updateGoalSavings(goalId, newAmount) {
  if (!db) throw new Error('Database not initialized');
  try {
    await db.runAsync(
      'UPDATE goals SET savedAmount = ? WHERE id = ?',
      [newAmount, goalId]
    );
    return true;
  } catch (error) {
    console.error('Error updating goal savings:', error);
    return false;
  }
}

export async function deleteGoal(goalId) {
  if (!db) throw new Error('Database not initialized');
  try {
    await db.runAsync('DELETE FROM goals WHERE id = ?', [goalId]);
    return true;
  } catch (error) {
    console.error('Error deleting goal:', error);
    return false;
  }
}

// Add this new function to get count of active goals
export async function getActiveGoalsCount() {
  if (!db) throw new Error('Database not initialized');
  try {
    const result = await db.getFirstAsync(
      'SELECT COUNT(*) as count FROM goals WHERE completedAt IS NULL AND savedAmount < targetAmount'
    );
    return result?.count || 0;
  } catch (error) {
    console.error('Error counting active goals:', error);
    return 0;
  }
}


// Add this function to mark a goal as completed
export async function markGoalAsCompleted(goalId) {
  if (!db) throw new Error('Database not initialized');
  try {
    await db.runAsync(
      'UPDATE goals SET completedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [goalId]
    );
    return true;
  } catch (error) {
    console.error('Error marking goal as completed:', error);
    return false;
  }
}

// Add this new function to get total savings from completed goals
export async function getCompletedGoalsSavings() {
  if (!db) throw new Error('Database not initialized');
  try {
    const result = await db.getFirstAsync(
      'SELECT SUM(savedAmount) as totalSavings FROM goals WHERE completedAt IS NOT NULL OR savedAmount >= targetAmount'
    );
    return result?.totalSavings || 0;
  } catch (error) {
    console.error('Error getting completed goals savings:', error);
    return 0;
  }
}

// Add this new function to get overall goal progress
export async function getOverallGoalProgress() {
  if (!db) throw new Error('Database not initialized');
  try {
    const result = await db.getFirstAsync(`
      SELECT 
        COALESCE(
          ROUND(
            (SUM(savedAmount) * 100.0) / NULLIF(SUM(targetAmount), 0)
          ), 
          0
        ) as progressPercentage
      FROM goals 
      WHERE completedAt IS NULL AND savedAmount < targetAmount
    `);
    return result?.progressPercentage || 0;
  } catch (error) {
    console.error('Error calculating goal progress:', error);
    return 0;
  }
}

console.log('App Directory:', FileSystem.documentDirectory);

export default db;
  
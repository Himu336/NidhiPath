import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BudgetManagerHeader from './budget-manager-header';
import GoalCreationPanel from './goal-creation-panel';
import ProgressDashboard from './progress-dashboard';
import { saveGoal, getGoals, updateGoalSavings, deleteGoal } from '../../../../db/budget-manager-sqlite';

interface Goal {
  id: number;
  item: string;
  targetAmount: number;
  savedAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  planAmount: number;
  duration: string;
  createdAt: string;
  completedAt: string | null;
}

interface SavingsPlan {
  frequency: 'daily' | 'weekly' | 'monthly';
  amount: number;
  duration: string;
}

export default function BudgetManagerScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCreationPanel, setShowCreationPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const loadedGoals = await getGoals();
      setGoals(loadedGoals);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async (goal: {
    item: string;
    amount: number;
    plan: SavingsPlan;
  }) => {
    try {
      const id = await saveGoal(goal);
      const newGoal: Goal = {
        id,
        item: goal.item,
        targetAmount: goal.amount,
        savedAmount: 0,
        frequency: goal.plan.frequency,
        planAmount: goal.plan.amount,
        duration: goal.plan.duration,
        createdAt: new Date().toISOString(),
        completedAt: null
      };
      setGoals(prevGoals => [...prevGoals, newGoal]);
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
    setShowCreationPanel(false);
  };

  const handleSavingsUpdate = async (goalId: number, newAmount: number) => {
    try {
      await updateGoalSavings(goalId, newAmount);
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, savedAmount: newAmount }
          : goal
      ));
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  const handleModifyPlan = async (goalId: number) => {
    try {
      await deleteGoal(goalId);
      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const handleGoalDeleted = async () => {
    try {
      const updatedGoals = await getGoals();
      setGoals(updatedGoals);
      Alert.alert('Success', 'Goal has been deleted');
    } catch (error) {
      console.error('Error refreshing goals after deletion:', error);
      Alert.alert('Error', 'Failed to refresh goals after deletion');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <BudgetManagerHeader />
        
        <View style={styles.content}>
          {!showCreationPanel ? (
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => setShowCreationPanel(true)}
            >
              <LinearGradient
                colors={['#7B68EE', '#9B89FF']}
                style={styles.createButtonGradient}
              >
                <MaterialCommunityIcons name="plus-circle" size={24} color="#FFF" />
                <Text style={styles.createButtonText}>Create New Goal</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.creationPanel}>
              <View style={styles.creationHeader}>
                <Text style={styles.creationTitle}>Set New Goal</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowCreationPanel(false)}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <GoalCreationPanel onCreateGoal={handleCreateGoal} />
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.dashboardSection}>
            <Text style={styles.sectionTitle}>Current Progress</Text>
            {goals.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons 
                  name="piggy-bank-outline" 
                  size={64} 
                  color="#DDD" 
                />
                <Text style={styles.emptyStateText}>
                  Start by creating your first savings goal!
                </Text>
              </View>
            ) : (
              <View style={styles.goalsList}>
                {goals.map((goal) => (
                  <View key={goal.id} style={styles.goalItem}>
                    <ProgressDashboard
                      goal={goal}
                      onSavingsUpdate={handleSavingsUpdate}
                      onModifyPlan={handleModifyPlan}
                      onGoalDeleted={handleGoalDeleted}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  createButton: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  creationPanel: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  creationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  creationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  divider: {
    height: 8,
    backgroundColor: '#F8F8F8',
  },
  dashboardSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    marginTop: 16,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  goalsList: {
    marginTop: 16,
    gap: 16,
  },
  goalItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

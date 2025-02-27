import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { updateGoalSavings, deleteGoal } from '../../../../db/budget-manager-sqlite';

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

interface ProgressDashboardProps {
  goal: Goal;
  onSavingsUpdate: (amount: number) => void;
  onGoalDeleted: () => void;
}

export default function ProgressDashboard({
  goal,
  onSavingsUpdate,
  onGoalDeleted,
}: ProgressDashboardProps) {
  const [progressAnim] = useState(new Animated.Value(0));
  const [showCelebration, setShowCelebration] = useState(false);
  const [todaySaved, setTodaySaved] = useState<boolean | null>(null);
  const [initialEstimation, setInitialEstimation] = useState<Date | null>(null);
  const [missedSavings, setMissedSavings] = useState(0);
  const [missedDays, setMissedDays] = useState(0);
  const [consecutiveMisses, setConsecutiveMisses] = useState(0);
  const [lastSavingDate, setLastSavingDate] = useState<Date | null>(null);

  const progressPercentage = (goal.savedAmount / goal.targetAmount) * 100;
  const remainingAmount = goal.targetAmount - goal.savedAmount;

  const isGoalCompleted = goal.savedAmount >= goal.targetAmount;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Check for milestones
    if ([25, 50, 75].includes(Math.floor(progressPercentage))) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [progressPercentage]);

  useEffect(() => {
    const baseEstimatedDays = Math.ceil(goal.targetAmount / goal.planAmount);
    let totalDays = 0;

    switch (goal.frequency) {
      case 'daily':
        totalDays = baseEstimatedDays;
        break;
      case 'weekly':
        totalDays = baseEstimatedDays * 7;
        break;
      case 'monthly':
        totalDays = baseEstimatedDays * 30;
        break;
    }

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + totalDays);
    setInitialEstimation(estimatedDate);
  }, [goal.targetAmount, goal.planAmount, goal.frequency]);

  const handleSavingsToggle = (saved: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const today = new Date();
    
    if (saved) {
      setLastSavingDate(today);
      setConsecutiveMisses(0);
      handleSavingsUpdate(goal.savedAmount + goal.planAmount);
    } else {
      // Only count as a miss if it's a new day
      if (!lastSavingDate || 
          lastSavingDate.toDateString() !== today.toDateString()) {
        setMissedDays(prev => prev + 1);
        setConsecutiveMisses(prev => prev + 1);
      }
    }
    
    setTodaySaved(saved);
  };

  const handleSavingsUpdate = async (amount: number) => {
    try {
      console.log('Updating savings for goal:', { goalId: goal.id, amount });
      await updateGoalSavings(goal.id, amount);
      onSavingsUpdate(amount);
    } catch (error) {
      console.error('Failed to update savings:', error);
    }
  };

  const handleDeleteGoal = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      const success = await deleteGoal(goal.id);
      if (success) {
        onGoalDeleted();
      } else {
        console.error('Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getEstimatedCompletion = () => {
    const remainingAmount = goal.targetAmount - goal.savedAmount;
    let totalDaysLeft = 0;

    // Calculate days left based on plan frequency and remaining amount
    switch (goal.frequency) {
      case 'daily':
        totalDaysLeft = Math.ceil(remainingAmount / goal.planAmount);
        break;
      case 'weekly':
        totalDaysLeft = Math.ceil(remainingAmount / goal.planAmount) * 7;
        break;
      case 'monthly':
        totalDaysLeft = Math.ceil(remainingAmount / goal.planAmount) * 30;
        break;
    }

    // If goal is completed
    if (remainingAmount <= 0) {
      return {
        timeLeft: 'Goal completed!'
      };
    }

    // Calculate months and days
    const monthsLeft = Math.floor(totalDaysLeft / 30);
    const daysLeft = totalDaysLeft % 30;

    // Format the time left message
    if (monthsLeft > 0) {
      return {
        timeLeft: `${monthsLeft} month${monthsLeft > 1 ? 's' : ''} ${
          daysLeft > 0 ? `and ${daysLeft} day${daysLeft > 1 ? 's' : ''}` : ''
        } left`
      };
    } else {
      return {
        timeLeft: `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`
      };
    }
  };

  const getSavingsPromptText = () => {
    switch (goal.frequency) {
      case 'daily':
        return 'Did you save today?';
      case 'weekly':
        return 'Did you save this week?';
      case 'monthly':
        return 'Did you save this month?';
      default:
        return 'Did you save?';
    }
  };

  const getEncouragementText = () => {
    switch (goal.frequency) {
      case 'daily':
        return 'No worries! Try saving a little tomorrow 💪';
      case 'weekly':
        return 'No worries! Next week is a new opportunity 💪';
      case 'monthly':
        return 'No worries! Next month is a new chance 💪';
      default:
        return 'No worries! Keep trying 💪';
    }
  };

  const renderCompletedGoal = () => (
    <View style={styles.completedCard}>
      <LinearGradient
        colors={['#F0FFF0', '#FFF']}
        style={styles.completedGradient}
      >
        <View style={styles.completedHeader}>
          <MaterialCommunityIcons name="trophy" size={48} color="#4CAF50" />
          <Text style={styles.completedTitle}>Goal Achieved! 🎉</Text>
        </View>

        <View style={styles.completedDetails}>
          <Text style={styles.completedItemName}>
            Your {goal.item} savings goal
          </Text>
          <Text style={styles.completedAmount}>
            ₹{goal.savedAmount}
          </Text>
          <Text style={styles.completedDate}>
            Completed on {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.newGoalButton}
          onPress={onGoalDeleted}
        >
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.newGoalGradient}
          >
            <Text style={styles.newGoalText}>Start New Goal</Text>
            <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderMotivationalMessage = () => {
    const estimation = getEstimatedCompletion();
    if (estimation.isAhead) {
      return (
        <Text style={styles.motivationalText}>
          🏆 Great job! You're ahead of schedule!
        </Text>
      );
    } else if (consecutiveMisses > 2) {
      return (
        <Text style={styles.warningText}>
          ⚠️ You've missed {consecutiveMisses} {goal.frequency} savings. 
          Try to save a little extra to stay on track!
        </Text>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {isGoalCompleted ? (
        renderCompletedGoal()
      ) : (
        <>
          <View style={styles.goalCard}>
            <LinearGradient
              colors={['#F8F0FF', '#FFF']}
              style={styles.goalGradient}
            >
              <View style={styles.goalHeader}>
                <MaterialCommunityIcons name="target" size={32} color="#7B68EE" />
                <Text style={styles.goalTitle}>{goal.item}</Text>
              </View>

              <View style={styles.progressContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
                <Text style={styles.progressText}>
                  {Math.floor(progressPercentage)}%
                </Text>
              </View>

              {showCelebration && (
                <View style={styles.celebration}>
                  <Text style={styles.celebrationText}>
                    🎉 Congratulations! You've reached a milestone!
                  </Text>
                </View>
              )}
            </LinearGradient>
          </View>

          <View style={styles.savingsPrompt}>
            <Text style={styles.promptTitle}>{getSavingsPromptText()}</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  todaySaved === true && styles.toggleButtonActive,
                ]}
                onPress={() => handleSavingsToggle(true)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    todaySaved === true && styles.toggleTextActive,
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  todaySaved === false && styles.toggleButtonActive,
                ]}
                onPress={() => handleSavingsToggle(false)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    todaySaved === false && styles.toggleTextActive,
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
            {todaySaved === false && (
              <Text style={styles.encouragementText}>
                {getEncouragementText()}
              </Text>
            )}
          </View>

          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Savings Breakdown</Text>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Total Saved</Text>
              <Text style={styles.breakdownValue}>₹{goal.savedAmount}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Remaining</Text>
              <Text style={styles.breakdownValue}>₹{remainingAmount}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Time Left</Text>
              <Text style={styles.breakdownValue}>
                {getEstimatedCompletion().timeLeft}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={handleDeleteGoal}>
            <LinearGradient
              colors={['#FF5252', '#FF1744']}
              style={styles.cancelGradient}
            >
              <Text style={styles.cancelText}>Cancel Goal</Text>
              <MaterialCommunityIcons name="close-circle" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          {renderMotivationalMessage()}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  goalCard: {
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
  goalGradient: {
    padding: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginLeft: 12,
  },
  progressContainer: {
    height: 24,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#7B68EE',
    borderRadius: 12,
  },
  progressText: {
    position: 'absolute',
    right: 12,
    top: 2,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  celebration: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(123, 104, 238, 0.1)',
    borderRadius: 8,
  },
  celebrationText: {
    fontSize: 14,
    color: '#7B68EE',
    textAlign: 'center',
    fontWeight: '600',
  },
  savingsPrompt: {
    padding: 16,
    alignItems: 'center',
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  toggleButtonActive: {
    backgroundColor: '#7B68EE',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#FFF',
  },
  encouragementText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  breakdownSection: {
    padding: 16,
    backgroundColor: '#F8F8F8',
    margin: 16,
    borderRadius: 16,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  cancelText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  completedCard: {
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
  completedGradient: {
    padding: 24,
    alignItems: 'center',
  },
  completedHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
  },
  completedDetails: {
    alignItems: 'center',
    marginBottom: 24,
  },
  completedItemName: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  completedAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 8,
  },
  completedDate: {
    fontSize: 14,
    color: '#666',
  },
  newGoalButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  newGoalGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  newGoalText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  motivationalText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#FF9800',
    textAlign: 'center',
    marginTop: 8,
  },
});

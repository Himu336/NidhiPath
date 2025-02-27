import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface SavingsPlan {
  frequency: 'daily' | 'weekly' | 'monthly';
  amount: number;
  duration: string;
}

interface GoalCreationPanelProps {
  onCreateGoal: (goal: {
    item: string;
    amount: number;
    plan: SavingsPlan;
  }) => void;
}

export default function GoalCreationPanel({ onCreateGoal }: GoalCreationPanelProps) {
  const [goalItem, setGoalItem] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<SavingsPlan | null>(null);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const calculateSavingsPlans = (amount: number): SavingsPlan[] => {
    return [
      {
        frequency: 'daily',
        amount: Math.ceil(amount / 90), // 3 months
        duration: '3 months',
      },
      {
        frequency: 'weekly',
        amount: Math.ceil(amount / 12), // 12 weeks
        duration: '12 weeks',
      },
      {
        frequency: 'monthly',
        amount: Math.ceil(amount / 4), // 4 months
        duration: '4 months',
      },
    ];
  };

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setGoalAmount(numericValue);
    setSelectedPlan(null);
  };

  const handlePlanSelect = (plan: SavingsPlan) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(plan);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCreateGoal = () => {
    if (goalItem && goalAmount && selectedPlan) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      onCreateGoal({
        item: goalItem,
        amount: parseInt(goalAmount),
        plan: selectedPlan,
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="target" size={32} color="#7B68EE" />
        <Text style={styles.headerTitle}>Set Your Goal, Start Saving!</Text>
        <Text style={styles.headerSubtitle}>
          Define your goal and choose a savings plan that works for you
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.label}>What are you saving for?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., New Phone, Laptop, Travel"
          value={goalItem}
          onChangeText={setGoalItem}
        />

        <Text style={styles.label}>How much do you need?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={goalAmount}
          onChangeText={handleAmountChange}
        />
      </View>

      {goalAmount ? (
        <View style={styles.plansContainer}>
          <Text style={styles.plansTitle}>Choose your savings plan</Text>
          {calculateSavingsPlans(parseInt(goalAmount)).map((plan, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePlanSelect(plan)}
              style={[
                styles.planCard,
                selectedPlan === plan && styles.selectedPlan,
              ]}
            >
              <LinearGradient
                colors={['#F8F0FF', '#FFF']}
                style={styles.planGradient}
              >
                <View style={styles.planInfo}>
                  <MaterialCommunityIcons
                    name={
                      plan.frequency === 'daily'
                        ? 'calendar-today'
                        : plan.frequency === 'weekly'
                        ? 'calendar-week'
                        : 'calendar-month'
                    }
                    size={24}
                    color="#7B68EE"
                  />
                  <View style={styles.planDetails}>
                    <Text style={styles.planAmount}>₹{plan.amount}</Text>
                    <Text style={styles.planFrequency}>{plan.frequency}</Text>
                  </View>
                </View>
                <Text style={styles.planDuration}>
                  Reach your goal in {plan.duration}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      <TouchableOpacity
        style={[
          styles.createButton,
          (!goalItem || !goalAmount || !selectedPlan) && styles.createButtonDisabled,
        ]}
        onPress={handleCreateGoal}
        disabled={!goalItem || !goalAmount || !selectedPlan}
      >
        <LinearGradient
          colors={
            goalItem && goalAmount && selectedPlan
              ? ['#7B68EE', '#9B89FF']
              : ['#DDD', '#DDD']
          }
          style={styles.createButtonGradient}
        >
          <Text style={styles.createButtonText}>Confirm & Start Saving</Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  inputSection: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  plansContainer: {
    padding: 16,
  },
  plansTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  planCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedPlan: {
    borderWidth: 2,
    borderColor: '#7B68EE',
  },
  planGradient: {
    padding: 16,
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planDetails: {
    marginLeft: 12,
  },
  planAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  planFrequency: {
    fontSize: 14,
    color: '#666',
  },
  planDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  createButton: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

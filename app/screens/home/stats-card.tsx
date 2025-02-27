import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  getActiveGoalsCount, 
  getCompletedGoalsSavings,
  getOverallGoalProgress 
} from '../../../db/budget-manager-sqlite';
import { useTranslation } from '../../../hooks/useTranslation';

export default function StatsCard() {
  const [activeGoals, setActiveGoals] = useState<number>(0);
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [goalProgress, setGoalProgress] = useState<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [count, savings, progress] = await Promise.all([
        getActiveGoalsCount(),
        getCompletedGoalsSavings(),
        getOverallGoalProgress()
      ]);
      setActiveGoals(count);
      setTotalSavings(savings);
      setGoalProgress(progress);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Your_Financial_Overview')}</Text>
        <Pressable style={styles.moreButton}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color="#666" />
        </Pressable>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
            <MaterialCommunityIcons name="wallet" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.statValue}>{formatCurrency(totalSavings)}</Text>
          <Text style={styles.statLabel}>{t('Total_savings')}</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <MaterialCommunityIcons name="target" size={24} color="#2196F3" />
          </View>
          <Text style={styles.statValue}>{activeGoals}</Text>
          <Text style={styles.statLabel}>{t('Active_goals')}</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
            <MaterialCommunityIcons name="trending-up" size={24} color="#FF9800" />
          </View>
          <Text style={styles.statValue}>{goalProgress}%</Text>
          <Text style={styles.statLabel}>{t('Goals_Progress')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  moreButton: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

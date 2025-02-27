import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function BudgetManagerHeader() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7B68EE', '#9B89FF']}  // Different purple gradient than loan feasibility
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <MaterialCommunityIcons 
              name="wallet-outline" 
              size={32} 
              color="#FFF" 
            />
            <Text style={styles.title}>Budget Manager</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Track your savings goals and manage your budget efficiently. Set targets, 
              monitor progress, and achieve your financial objectives.
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons 
                name="chart-timeline-variant" 
                size={20} 
                color="#FFF" 
              />
              <Text style={styles.featureText}>Track Progress</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons 
                name="target" 
                size={20} 
                color="#FFF" 
              />
              <Text style={styles.featureText}>Set Goals</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons 
                name="bell-ring-outline" 
                size={20} 
                color="#FFF" 
              />
              <Text style={styles.featureText}>Reminders</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerGradient: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  content: {
    paddingHorizontal: 20,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 12,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#FFF',
    lineHeight: 20,
    opacity: 0.9,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  featureItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  featureText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

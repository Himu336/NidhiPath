import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SmartGuideProps {
  onActionPress?: () => void;
}

export default function SmartGuide({ onActionPress }: SmartGuideProps) {
  // Animation setup
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  // Daily recommendations array
  const recommendations = [
    "Track your daily expenses to build better spending habits",
    "Set up a savings goal for your next big purchase",
    "Review your monthly budget to optimize spending",
    "Check your investment portfolio performance",
  ];

  // Randomly select a recommendation
  const dailyRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.header}>
        <Text style={styles.label}>TODAY'S SMART TIP</Text>
        <MaterialCommunityIcons name="robot" size={24} color="#FF7F50" />
      </View>

      <View style={styles.content}>
        <Text style={styles.recommendationText}>
          {dailyRecommendation}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onActionPress}
        activeOpacity={0.8}
      >
        <Text style={styles.actionButtonText}>Try Now</Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF5EE', // Soft peach background
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#666',
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: 20,
  },
  recommendationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#7B68EE', // Medium slate blue
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoanHeader() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#45A049']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <MaterialCommunityIcons 
              name="calculator-variant" 
              size={32} 
              color="#FFF" 
            />
            <Text style={styles.title}>Loan Feasibility Check</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Get instant insights on your loan approval chances. Our AI-powered system 
              analyzes your financial data to provide a reliable feasibility score.
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons 
                name="lightning-bolt" 
                size={20} 
                color="#FFF" 
              />
              <Text style={styles.featureText}>Instant Analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons 
                name="shield-check" 
                size={20} 
                color="#FFF" 
              />
              <Text style={styles.featureText}>AI-Powered</Text>
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
    justifyContent: 'flex-start',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featureText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});

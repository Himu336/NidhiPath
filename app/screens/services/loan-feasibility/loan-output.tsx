import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface LoanOutputProps {
  decisionRating: number;
  formData: {
    amount: number;
    interest_rate: number;
    tenure: number;
  };
}

export default function LoanOutput({ decisionRating, formData }: LoanOutputProps) {
  const getStatusColor = () => {
    if (decisionRating >= 80) return ['#4CAF50', '#45A049'];
    if (decisionRating >= 60) return ['#FFA726', '#FB8C00'];
    return ['#F44336', '#E53935'];
  };

  const getStatusMessage = () => {
    if (decisionRating >= 80) {
      return {
        title: 'High Approval Chance',
        message: 'Your profile shows strong eligibility for this loan.',
        icon: 'check-circle',
      };
    }
    if (decisionRating >= 60) {
      return {
        title: 'Moderate Approval Chance',
        message: 'You may need to provide additional documentation.',
        icon: 'alert',
      };
    }
    return {
      title: 'Low Approval Chance',
      message: 'Consider adjusting your loan parameters or improving your financial profile.',
      icon: 'alert-circle',
    };
  };

  const calculateEMI = () => {
    const p = formData.amount;
    const r = formData.interest_rate / 1200; // Convert annual rate to monthly and percentage to decimal
    const n = formData.tenure;
    
    const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const status = getStatusMessage();
  const emi = calculateEMI();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getStatusColor()}
        style={styles.scoreContainer}
      >
        <Text style={styles.scoreLabel}>Approval Score</Text>
        <Text style={styles.scoreValue}>{decisionRating}%</Text>
        <MaterialCommunityIcons 
          name={status.icon} 
          size={32} 
          color="#FFF" 
        />
      </LinearGradient>

      <View style={styles.detailsContainer}>
        <Text style={styles.statusTitle}>{status.title}</Text>
        <Text style={styles.statusMessage}>{status.message}</Text>

        <View style={styles.separator} />

        <View style={styles.emiContainer}>
          <Text style={styles.emiLabel}>Estimated Monthly EMI</Text>
          <Text style={styles.emiValue}>₹{emi.toLocaleString('en-IN')}</Text>
          <Text style={styles.emiNote}>
            *EMI is calculated based on the provided interest rate and tenure
          </Text>
        </View>

        <View style={styles.loanDetailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Loan Amount</Text>
            <Text style={styles.detailValue}>
              ₹{formData.amount.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Interest Rate</Text>
            <Text style={styles.detailValue}>{formData.interest_rate}%</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tenure</Text>
            <Text style={styles.detailValue}>{formData.tenure} months</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scoreContainer: {
    padding: 24,
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreValue: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailsContainer: {
    padding: 24,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  statusMessage: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  emiContainer: {
    marginBottom: 16,
  },
  emiLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emiValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  emiNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  loanDetailsContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

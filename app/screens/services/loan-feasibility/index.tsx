import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import LoanForm from './loan-form';
import LoanOutput from './loan-output';
import { predictLoanFeasibility, validateLoanData } from '../../../../scripts/loan-feasibility-prediction';

export default function LoanFeasibilityScreen() {
  const [formData, setFormData] = useState({
    credit_score: 750,
    amount: 500000,
    interest_rate: 8.5,
    tenure: 36,
    income: 50000,
    savings: 100000,
    existing_loans: 1,
    employment_status: 1,
    expenses: 20000,
    financial_goals: 8,
  });

  const [decisionRating, setDecisionRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    const { isValid, errors } = validateLoanData(formData);
    setErrors(errors);

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Submitting form data:', formData);
      const result = await predictLoanFeasibility(formData);
      console.log('API response:', result);

      if (result.success && result.decision_rating !== undefined) {
        setDecisionRating(result.decision_rating);
      } else {
        setError(result.error || 'Failed to get loan decision. Please check your input data.');
      }
    } catch (error) {
      console.error('Error predicting loan feasibility:', error);
      setError('An error occurred while processing your request. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LoanForm 
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleSubmit}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Calculating loan approval...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {decisionRating !== null && !isLoading && (
        <LoanOutput 
          decisionRating={decisionRating}
          formData={formData}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
});

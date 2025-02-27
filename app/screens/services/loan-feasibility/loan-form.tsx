import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

interface LoanFormProps {
  formData: {
    credit_score: number;
    amount: number;
    interest_rate: number;
    tenure: number;
    income: number;
    savings: number;
    existing_loans: number;
    employment_status: number;
    expenses: number;
    financial_goals: number;
  };
  setFormData: (data: any) => void;
  errors: Record<string, string>;
  onSubmit: () => void;
}

export default function LoanForm({ formData, setFormData, errors, onSubmit }: LoanFormProps) {
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const renderSection = (title: string, icon: string) => (
    <View style={styles.sectionHeader}>
      <MaterialCommunityIcons name={icon} size={24} color="#4CAF50" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formCard}>
        {/* Loan Details Section */}
        {renderSection('Loan Details', 'cash-multiple')}
        <View style={styles.inputGroup}>
          <View style={styles.amountContainer}>
            <Text style={styles.label}>Loan Amount</Text>
            <Text style={styles.amountDisplay}>{formatCurrency(formData.amount)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={10000}
              maximumValue={1000000}
              value={formData.amount}
              onValueChange={(value) => setFormData({ ...formData, amount: Math.round(value) })}
              minimumTrackTintColor="#4CAF50"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#4CAF50"
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Interest Rate (%)</Text>
              <TextInput
                style={[styles.input, errors.interest_rate && styles.inputError]}
                keyboardType="numeric"
                value={formData.interest_rate.toString()}
                onChangeText={(text) => setFormData({ ...formData, interest_rate: parseFloat(text) || 0 })}
                placeholder="e.g., 8.5"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Tenure (Months)</Text>
              <TextInput
                style={[styles.input, errors.tenure && styles.inputError]}
                keyboardType="numeric"
                value={formData.tenure.toString()}
                onChangeText={(text) => setFormData({ ...formData, tenure: parseInt(text) || 0 })}
                placeholder="e.g., 36"
              />
            </View>
          </View>
        </View>

        {/* Financial Profile Section */}
        {renderSection('Financial Profile', 'account-cash')}
        <View style={styles.inputGroup}>
          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Monthly Income</Text>
              <TextInput
                style={[styles.input, errors.income && styles.inputError]}
                keyboardType="numeric"
                value={formData.income.toString()}
                onChangeText={(text) => setFormData({ ...formData, income: parseFloat(text) || 0 })}
                placeholder="Enter monthly income"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Total Savings</Text>
              <TextInput
                style={[styles.input, errors.savings && styles.inputError]}
                keyboardType="numeric"
                value={formData.savings.toString()}
                onChangeText={(text) => setFormData({ ...formData, savings: parseFloat(text) || 0 })}
                placeholder="Enter total savings"
              />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Monthly Expenses</Text>
              <TextInput
                style={[styles.input, errors.expenses && styles.inputError]}
                keyboardType="numeric"
                value={formData.expenses.toString()}
                onChangeText={(text) => setFormData({ ...formData, expenses: parseFloat(text) || 0 })}
                placeholder="Enter monthly expenses"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Existing Loans</Text>
              <TextInput
                style={[styles.input, errors.existing_loans && styles.inputError]}
                keyboardType="numeric"
                value={formData.existing_loans.toString()}
                onChangeText={(text) => setFormData({ ...formData, existing_loans: parseInt(text) || 0 })}
                placeholder="Number of loans"
              />
            </View>
          </View>
        </View>

        {/* Employment Status */}
        {renderSection('Employment Status', 'briefcase')}
        <View style={styles.inputGroup}>
          <View style={styles.employmentContainer}>
            <TouchableOpacity
              style={[
                styles.employmentOption,
                formData.employment_status === 1 && styles.employmentOptionActive
              ]}
              onPress={() => setFormData({ ...formData, employment_status: 1 })}
            >
              <MaterialCommunityIcons 
                name="briefcase" 
                size={24} 
                color={formData.employment_status === 1 ? '#FFF' : '#666'} 
              />
              <Text style={[
                styles.employmentText,
                formData.employment_status === 1 && styles.employmentTextActive
              ]}>Employed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.employmentOption,
                formData.employment_status === 0 && styles.employmentOptionActive
              ]}
              onPress={() => setFormData({ ...formData, employment_status: 0 })}
            >
              <MaterialCommunityIcons 
                name="briefcase-off" 
                size={24} 
                color={formData.employment_status === 0 ? '#FFF' : '#666'} 
              />
              <Text style={[
                styles.employmentText,
                formData.employment_status === 0 && styles.employmentTextActive
              ]}>Unemployed</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Financial Goals */}
        {renderSection('Financial Planning', 'trending-up')}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Financial Planning Score (1-10)</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={formData.financial_goals}
              onValueChange={(value) => setFormData({ ...formData, financial_goals: value })}
              minimumTrackTintColor="#4CAF50"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#4CAF50"
            />
            <Text style={styles.sliderValue}>{formData.financial_goals}</Text>
          </View>
        </View>
      </View>

      {/* Add submit button at the bottom */}
      <View style={styles.submitContainer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={onSubmit}
        >
          <MaterialCommunityIcons name="calculator-variant" size={24} color="#FFF" />
          <Text style={styles.submitButtonText}>Calculate Loan Approval</Text>
        </TouchableOpacity>
        {Object.keys(errors).length > 0 && (
          <View style={styles.errorsContainer}>
            {Object.entries(errors).map(([field, message]) => (
              <Text key={field} style={styles.errorText}>
                • {message}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF5252',
    borderWidth: 1,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  amountContainer: {
    marginBottom: 16,
  },
  amountDisplay: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderContainer: {
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 8,
  },
  employmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  employmentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    gap: 8,
  },
  employmentOptionActive: {
    backgroundColor: '#4CAF50',
  },
  employmentText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  employmentTextActive: {
    color: '#FFF',
  },
  submitContainer: {
    padding: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 4,
  },
});

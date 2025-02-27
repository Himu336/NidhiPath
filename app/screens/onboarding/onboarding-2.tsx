import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface FormData {
  name: string;
  age: string;
  gender: 'male' | 'female' | '';
  occupation: string;
  income: string;
  residence: 'rural' | 'urban' | '';
  ownHouse: 'yes' | 'no' | '';
  loan: 'yes' | 'no' | '';
}

interface FormErrors {
  [key: string]: string;
}

const OnboardingScreen2: React.FC = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    occupation: "",
    income: "",
    residence: "",
    ownHouse: "",
    loan: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18) {
      newErrors.age = "Please enter a valid age (18 or above)";
    }

    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = "Occupation is required";
    }

    if (!formData.income.trim()) {
      newErrors.income = "Income is required";
    } else if (isNaN(Number(formData.income))) {
      newErrors.income = "Please enter a valid income";
    }

    if (!formData.residence.trim()) {
      newErrors.residence = "Residence is required";
    } else if (!["rural", "urban"].includes(formData.residence.toLowerCase())) {
      newErrors.residence = "Please enter either Rural or Urban";
    }

    if (!formData.ownHouse.trim()) {
      newErrors.ownHouse = "This field is required";
    } else if (!["yes", "no"].includes(formData.ownHouse.toLowerCase())) {
      newErrors.ownHouse = "Please enter either Yes or No";
    }

    if (!formData.loan.trim()) {
      newErrors.loan = "This field is required";
    } else if (!["yes", "no"].includes(formData.loan.toLowerCase())) {
      newErrors.loan = "Please enter either Yes or No";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Navigate to onboarding-3
      router.push('/screens/onboarding/onboarding-3');
    } else {
      Alert.alert("Error", "Please fix the errors in the form");
    }
  };

  const updateFormData = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  const renderInput = (
    key: keyof FormData,
    placeholder: string,
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    keyboardType: "default" | "numeric" = "default"
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <MaterialCommunityIcons 
          name={icon} 
          size={20} 
          color={errors[key] ? "#FF6B6B" : "#6A4BBC"} 
          style={styles.inputIcon}
        />
        <TextInput
          style={[
            styles.input,
            errors[key] && styles.inputError
          ]}
          placeholder={placeholder}
          value={formData[key]}
          onChangeText={(value) => updateFormData(key, value)}
          keyboardType={keyboardType}
          placeholderTextColor="#999"
        />
      </View>
      {errors[key] && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={14} color="#FF6B6B" />
          <Text style={styles.errorText}>{errors[key]}</Text>
        </View>
      )}
    </View>
  );

  const renderSelectionButtons = (
    key: keyof FormData,
    title: string,
    options: { value: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }[]
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.selectionTitle}>{title}</Text>
      <View style={styles.selectionContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.selectionButton,
              formData[key] === option.value && styles.selectionButtonActive,
              errors[key] && styles.selectionButtonError
            ]}
            onPress={() => updateFormData(key, option.value)}
          >
            <MaterialCommunityIcons
              name={option.icon}
              size={24}
              color={formData[key] === option.value ? '#FFF' : '#666'}
            />
            <Text
              style={[
                styles.selectionButtonText,
                formData[key] === option.value && styles.selectionButtonTextActive
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors[key] && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={14} color="#FF6B6B" />
          <Text style={styles.errorText}>{errors[key]}</Text>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={['#6A4BBC', '#8468D9']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.headerContainer}>
              <Text style={styles.heading}>Personal Details</Text>
              <Text style={styles.subheading}>Help us know you better</Text>
            </View>

            {renderInput("name", "Full Name", "account")}
            {renderInput("age", "Age", "calendar", "numeric")}
            
            {renderSelectionButtons("gender", "Gender", [
              { value: 'male', icon: 'gender-male', label: 'Male' },
              { value: 'female', icon: 'gender-female', label: 'Female' }
            ])}

            {renderInput("occupation", "Occupation", "briefcase")}
            {renderInput("income", "Monthly Income", "currency-inr", "numeric")}
            
            {renderSelectionButtons("residence", "Place of Residence", [
              { value: 'urban', icon: 'city-variant', label: 'Urban' },
              { value: 'rural', icon: 'home-variant', label: 'Rural' }
            ])}

            {renderSelectionButtons("ownHouse", "Do you own a house?", [
              { value: 'yes', icon: 'home-plus', label: 'Yes' },
              { value: 'no', icon: 'home-minus', label: 'No' }
            ])}

            {renderSelectionButtons("loan", "Do you have any existing loans?", [
              { value: 'yes', icon: 'cash-plus', label: 'Yes' },
              { value: 'no', icon: 'cash-minus', label: 'No' }
            ])}

            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={['#6A4BBC', '#8468D9']}
                style={styles.buttonGradient}
              >
                <Text style={styles.continueText}>Continue</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContainer: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: "#666",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: "#333",
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 12,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginLeft: 4,
  },
  continueButton: {
    marginTop: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  continueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  selectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  selectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  selectionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    minWidth: 100,
    gap: 8,
  },
  selectionButtonActive: {
    backgroundColor: '#6A4BBC',
    borderColor: '#6A4BBC',
  },
  selectionButtonError: {
    borderColor: '#FF6B6B',
  },
  selectionButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  selectionButtonTextActive: {
    color: '#FFF',
  },
});

export default OnboardingScreen2;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';

interface Language {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { id: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { id: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' }
];

export default function OnboardingScreen1() {
  const router = useRouter();
  const { t, changeLanguage } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    if (language.id === 'en' || language.id === 'hi') {
      changeLanguage(language.id as 'en' | 'hi');
    } else {
      Alert.alert(
        'Coming Soon',
        `${language.name} language support will be added soon!`,
        [{ text: 'OK', onPress: () => setSelectedLanguage(languages[0]) }]
      );
    }
    setShowLanguageModal(false);
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        selectedLanguage.id === item.id && styles.selectedLanguageItem
      ]}
      onPress={() => handleLanguageSelect(item)}
    >
      <Text style={styles.languageFlag}>{item.flag}</Text>
      <View style={styles.languageTextContainer}>
        <Text style={styles.languageName}>{item.name}</Text>
        <Text style={styles.languageNativeName}>{item.nativeName}</Text>
      </View>
      {selectedLanguage.id === item.id && (
        <MaterialCommunityIcons name="check" size={24} color="#6A4BBC" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6A4BBC', '#8468D9']}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.languageSelector}
            onPress={() => setShowLanguageModal(true)}
          >
            <Text style={styles.selectedLanguageText}>
              {selectedLanguage.flag} {selectedLanguage.name}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.appBranding}>
            <MaterialCommunityIcons 
              name="wallet-plus" 
              size={64} 
              color="#FFF" 
            />
            <Text style={styles.appName}>NidhiPath</Text>
            <Text style={styles.appTagline}>आपका वित्तीय साथी</Text>
          </View>

          <View style={styles.welcomeCard}>
            <Text style={styles.title}>{t('Your_Financial_Overview')}</Text>
            <Text style={styles.subtitle}>{t('Let\'s_check_your_finances')}</Text>
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push('/screens/onboarding/onboarding-2')}
          >
            <LinearGradient
              colors={['#4CAF50', '#45A049']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>{t('Continue')}</Text>
              <MaterialCommunityIcons name="arrow-right" size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Select Language</Text>
                <Text style={styles.modalSubtitle}>भाषा चुनें</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowLanguageModal(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedLanguageText: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  appBranding: {
    alignItems: 'center',
    marginTop: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 16,
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 'auto',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  selectedLanguageItem: {
    backgroundColor: '#F8F9FA',
  },
  disabledLanguageItem: {
    opacity: 0.6,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  languageNativeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});
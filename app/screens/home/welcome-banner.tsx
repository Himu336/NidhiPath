import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { predictCreditScore, getMockUserData, startPeriodicUpdates } from '../../../scripts/credit-score-prediction';
import { useTranslation } from '../../../hooks/useTranslation';

export default function WelcomeBanner() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;
  const [creditScore, setCreditScore] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = React.useState(false);
  const updateAnim = React.useRef(new Animated.Value(1)).current;

  const animateUpdate = () => {
    setIsUpdating(true);
    Animated.sequence([
      Animated.timing(updateAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(updateAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setIsUpdating(false));
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'Just now';
    return `${Math.floor(seconds / 60)}m ago`;
  };

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const userData = getMockUserData(); // Replace with actual user data when available
    const cleanup = startPeriodicUpdates((score) => {
      setCreditScore(score);
      setIsLoading(false);
      setLastUpdate(new Date());
      animateUpdate();
    }, userData);

    return () => {
      cleanup();
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['rgba(123, 104, 238, 0.9)', 'rgba(155, 137, 255, 0.8)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.leftContent}>
            <View style={styles.greetingContainer}>
              <MaterialCommunityIcons 
                name={new Date().getHours() < 17 ? "weather-sunny" : "weather-night"} 
                size={24} 
                color="#FFF" 
                style={styles.weatherIcon}
              />
              <Text style={styles.greeting}>{t('Good_Evening')},</Text>
            </View>
            <Text style={styles.name}>Himansh 👋</Text>
            <View style={styles.taglineContainer}>
              <MaterialCommunityIcons 
                name="chart-line-variant" 
                size={16} 
                color="#FFF" 
                style={styles.taglineIcon}
              />
              <Text style={styles.tagline}>{t('Let\'s_check_your_finances')}</Text>
            </View>
          </View>

          <View style={styles.rightContent}>
            <View style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>{t('AI_Credit_Score')}</Text>
                
              </View>
              {isLoading ? (
                <Text style={styles.balanceAmount}>Loading...</Text>
              ) : (
                <Animated.View style={{ opacity: updateAnim }}>
                  <Text style={styles.balanceAmount}>{creditScore || '---'}</Text>
                  <View style={styles.trendContainer}>
                    <MaterialCommunityIcons 
                      name="trending-up" 
                      size={16} 
                      color="#4CAF50" 
                    />
                    <Text style={styles.trendText}>+40</Text>
                  </View>
                </Animated.View>
              )}
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  gradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  weatherIcon: {
    marginRight: 8,
    opacity: 0.9,
  },
  greeting: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.9,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  taglineIcon: {
    marginRight: 6,
    opacity: 0.9,
  },
  tagline: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  rightContent: {
    marginLeft: 20,
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 16,
    minWidth: 140,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
  },
  updateTime: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '600',
  },
});

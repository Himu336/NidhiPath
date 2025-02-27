import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';

const { width } = Dimensions.get('window');

interface ServiceButtonProps {
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  colors: string[];
  onPress: () => void;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({
  title,
  description,
  icon,
  colors,
  onPress,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onPress());
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={styles.buttonContainer}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={icon} size={32} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.buttonTitle}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={24} 
            color="#fff" 
            style={styles.arrow}
          />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ServicesPanel() {
  const router = useRouter();
  const { t } = useTranslation();

  const services = [
    {
      title: t('Budget_Manager'),
      description: t('Manage_You_Budget_with_Ease'),
      icon: 'wallet-outline' as const,
      colors: ['#7B68EE', '#9B89FF'],
      route: '/screens/services/budget-manager',
    },
    {
      title: t('SHG_Communities'),
      description: t('Connect_&_Grow_with_Self-Help_Groups'),
      icon: 'account-group' as const,
      colors: ['#FF7F50', '#FFA07A'],
      route: '/screens/services/self-help-groups',
    },
    {
      title: 'Loan Feasibility',
      description: 'Check Your Loan Approval Chances',
      icon: 'calculator-variant' as const,
      colors: ['#4CAF50', '#66BB6A'],
      route: '/screens/services/loan-feasibility',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8F9FF', '#F0F3FF']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Modern Decorative Elements */}
        <View style={styles.patternContainer}>
          <LinearGradient
            colors={['rgba(123, 104, 238, 0.1)', 'rgba(155, 137, 255, 0.05)']}
            style={styles.pattern}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons 
              name="star-four-points" 
              size={24} 
              color="#7B68EE" 
              style={styles.titleIcon}
            />
            <Text style={styles.title}>{t('Essential_Services')}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{services.length} {t('services')}</Text>
          </View>
        </View>

        <View style={styles.servicesGrid}>
          {services.map((service, index) => (
            <ServiceButton
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              colors={service.colors}
              onPress={() => router.push(service.route)}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  backgroundGradient: {
    padding: 20,
    position: 'relative',
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  pattern: {
    position: 'absolute',
    top: -width,
    left: -width,
    right: -width,
    bottom: -width,
    transform: [{ rotate: '15deg' }],
    opacity: 0.5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: 'rgba(123, 104, 238, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(123, 104, 238, 0.2)',
  },
  badgeText: {
    color: '#7B68EE',
    fontSize: 12,
    fontWeight: '600',
  },
  servicesGrid: {
    gap: 16,
  },
  buttonContainer: {
    marginBottom: 12,
  },
  gradient: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  arrow: {
    marginLeft: 8,
  },
});

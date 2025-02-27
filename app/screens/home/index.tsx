import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WelcomeBanner from './welcome-banner';
import StatsCard from './stats-card';
import ServicesPanel from './services-panel';
import SmartGuide from './smart-guide';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Decorative Background Elements */}
      <View style={styles.backgroundElements}>
        <LinearGradient
          colors={['#7B68EE', '#9B89FF']}
          style={styles.mainGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Floating Circles */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.1)',
            'rgba(255,255,255,0.05)',
            'rgba(255,255,255,0)'
          ]}
          style={styles.overlayGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Decorative Icons */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name="chart-line" 
            size={24} 
            color="rgba(255,255,255,0.1)" 
            style={styles.decorativeIcon}
          />
          <MaterialCommunityIcons 
            name="wallet" 
            size={24} 
            color="rgba(255,255,255,0.1)" 
            style={[styles.decorativeIcon, styles.icon2]}
          />
          <MaterialCommunityIcons 
            name="piggy-bank" 
            size={24} 
            color="rgba(255,255,255,0.1)" 
            style={[styles.decorativeIcon, styles.icon3]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#FFF"
          />
        }
      >
        <WelcomeBanner />
        <View style={styles.contentContainer}>
          <View style={styles.statsContainer}>
            <StatsCard />
          </View>
          <View style={styles.servicesContainer}>
            <ServicesPanel />
          </View>
          <View style={styles.guideContainer}>
            <SmartGuide />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7B68EE',
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    overflow: 'hidden',
  },
  mainGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  circle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.4,
    right: -width * 0.2,
    transform: [{ scale: 1.2 }],
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    top: width * 0.2,
    left: -width * 0.3,
    transform: [{ scale: 0.8 }],
  },
  circle3: {
    width: width * 0.4,
    height: width * 0.4,
    bottom: width * 0.2,
    right: -width * 0.2,
    transform: [{ scale: 1.4 }],
  },
  overlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.6,
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  decorativeIcon: {
    position: 'absolute',
    opacity: 0.15,
  },
  icon2: {
    top: '30%',
    left: '15%',
    transform: [{ rotate: '15deg' }],
  },
  icon3: {
    bottom: '25%',
    right: '10%',
    transform: [{ rotate: '-20deg' }],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  contentContainer: {
    marginTop: -20,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  servicesContainer: {
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  guideContainer: {
    paddingHorizontal: 16,
  },
});

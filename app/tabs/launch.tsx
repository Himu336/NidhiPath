import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';  
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LaunchScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LaunchScreen = ({ navigation }: LaunchScreenProps) => {
  const imageAnimation = new Animated.Value(0);
  const contentAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.stagger(400, [
      Animated.timing(imageAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#6B4E9B', '#563D8C']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Upper Section - Image */}
        <Animated.View 
          style={[
            styles.upperSection,
            {
              opacity: imageAnimation,
              transform: [{
                translateY: imageAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              }],
            },
          ]}
        >
          <Image 
            source={require('../../assets/images/Boarding_screen.jpeg')}
            style={styles.illustration}
            resizeMode="contain"
            onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
          />
        </Animated.View>

        {/* Lower Section - Content */}
        <Animated.View 
          style={[
            styles.lowerSection,
            {
              opacity: contentAnimation,
              transform: [{
                translateY: contentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              }],
            },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle} />
          </View>

          <View style={styles.textContent}>
            <Text style={styles.title}>
              Empower. Educate.{'\n'}Elevate.
            </Text>
            <Text style={styles.subtitle}>
              Your journey to financial freedom starts here.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  upperSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  lowerSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  textContent: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#563D8C',
  },
});

export default LaunchScreen;

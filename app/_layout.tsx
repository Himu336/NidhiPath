import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, usePathname } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigationBar from './components/navigation-bar';

export default function RootLayout() {
  const pathname = usePathname();
  const isOnboarding = pathname.includes('/screens/onboarding');

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.content}>
          <Slot />
        </View>
        {!isOnboarding && <NavigationBar />}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

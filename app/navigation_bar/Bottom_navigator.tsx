import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function BottomNavigator() {
  const router = useRouter();
  const currentPath = usePathname();

  const tabs = [
    { name: 'Home', icon: 'home', path: '/tabs/Home' },
    { name: 'Chatbot', icon: 'chatbubble', path: '/tabs/Chatbot' },
    { name: 'Services', icon: 'grid', path: '/tabs/Services' },
    { name: 'Community', icon: 'people', path: '/tabs/Community' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.path)}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={isActive ? '#563D8C' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                { color: isActive ? '#563D8C' : '#666' }
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

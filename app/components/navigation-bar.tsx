import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function NavigationBar() {
  const router = useRouter();
  const currentPath = usePathname();

  const navItems = [
    {
      name: 'Home',
      icon: 'home',
      route: '/screens/home',
    },
    {
      name: 'AI Chat',
      icon: 'robot',
      route: '/screens/chatbot',
    },
    {
      name: 'Community',
      icon: 'account-group',
      route: '/screens/community',
    },
  ];

  const TabButton = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = currentPath === item.route;
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePress = () => {
      // Animation on press
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
        })
      ]).start();

      router.push(item.route);
    };

    return (
      <TouchableOpacity
        style={styles.tabButton}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Animated.View 
          style={[
            styles.tabContent,
            isActive && styles.activeTab,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <MaterialCommunityIcons
            name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={24}
            color={isActive ? '#7B68EE' : '#666'}
          />
          <Text style={[
            styles.tabText,
            isActive && styles.activeText
          ]}>
            {item.name}
          </Text>
          {isActive && <View style={styles.activeIndicator} />}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {navItems.map((item, index) => (
        <TabButton key={index} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F0FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E3FF',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    position: 'relative',
    width: 80,
    height: 56,
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#EBE5FF',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  activeText: {
    color: '#7B68EE',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7B68EE',
  },
});

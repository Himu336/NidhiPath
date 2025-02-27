import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SHGScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderFeatureCard = (title: string, description: string, icon: string) => (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#7B68EE15', '#9B89FF15']}
        style={styles.cardGradient}
      >
        <View style={styles.cardIcon}>
          <MaterialCommunityIcons name={icon} size={24} color="#7B68EE" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Groups</Text>
        {renderFeatureCard(
          'Local Women Empowerment Group',
          'Join a community of women supporting each other in financial growth',
          'account-group'
        )}
        {renderFeatureCard(
          'Small Business Circle',
          'Connect with local entrepreneurs and share resources',
          'store'
        )}
        {renderFeatureCard(
          'Rural Development Initiative',
          'Participate in community development projects',
          'home-group'
        )}
      </View>

      <TouchableOpacity style={styles.createButton}>
        <LinearGradient
          colors={['#7B68EE', '#9B89FF']}
          style={styles.createButtonGradient}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
          <Text style={styles.createButtonText}>Create New Group</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  createButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

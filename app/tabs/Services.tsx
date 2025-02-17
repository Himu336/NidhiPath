import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ServiceCategory {
  id: number;
  title: string;
  icon: string;
  services: Service[];
}

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 1,
    title: "Investment Services",
    icon: "trending-up",
    services: [
      {
        id: 1,
        name: "Stock Trading",
        description: "Start trading stocks with expert guidance",
        icon: "stats-chart",
      },
      {
        id: 2,
        name: "Mutual Funds",
        description: "Invest in diversified portfolios",
        icon: "pie-chart",
      },
    ],
  },
  {
    id: 2,
    title: "Banking Services",
    icon: "card",
    services: [
      {
        id: 3,
        name: "Savings Account",
        description: "High-yield savings accounts",
        icon: "wallet",
      },
      {
        id: 4,
        name: "Fixed Deposits",
        description: "Secure your money with guaranteed returns",
        icon: "lock-closed",
      },
    ],
  },
  {
    id: 3,
    title: "Insurance",
    icon: "shield-checkmark",
    services: [
      {
        id: 5,
        name: "Life Insurance",
        description: "Protect your family's future",
        icon: "heart",
      },
      {
        id: 6,
        name: "Health Insurance",
        description: "Comprehensive health coverage",
        icon: "medical",
      },
    ],
  },
];

export default function Services() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Services</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Categories */}
        {serviceCategories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Ionicons name={category.icon as any} size={24} color="#563D8C" />
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>

            {/* Services in Category */}
            <View style={styles.servicesGrid}>
              {category.services.map((service) => (
                <TouchableOpacity 
                  key={service.id} 
                  style={styles.serviceCard}
                  onPress={() => {}}
                >
                  <View style={styles.serviceIcon}>
                    <Ionicons name={service.icon as any} size={24} color="#563D8C" />
                  </View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>
                  <View style={styles.serviceArrow}>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#563D8C',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  headerButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  servicesGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0EDFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#666',
    flex: 2,
    marginRight: 8,
  },
  serviceArrow: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

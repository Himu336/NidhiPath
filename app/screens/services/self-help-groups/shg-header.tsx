import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function SHGHeader() {
  const router = useRouter();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const modalAnimation = React.useRef(new Animated.Value(0)).current;

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const toggleInfoModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!infoModalVisible) {
      setInfoModalVisible(true);
      Animated.spring(modalAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setInfoModalVisible(false));
    }
  };

  return (
    <>
      <LinearGradient
        colors={['#7B68EE', '#9B89FF']}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.title}>Self Help Groups (SHG)</Text>

        <TouchableOpacity
          onPress={toggleInfoModal}
          style={styles.infoButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="information" size={28} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>

      <Modal
        visible={infoModalVisible}
        transparent
        animationType="none"
        onRequestClose={toggleInfoModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleInfoModal}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [600, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Self-Help Groups</Text>
              <TouchableOpacity onPress={toggleInfoModal}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>What are SHGs?</Text>
                <Text style={styles.infoText}>
                  Self-Help Groups (SHGs) are informal associations of people who come together to find ways to improve their living conditions through collective savings and undertaking income-generating activities.
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Eligibility Criteria</Text>
                <View style={styles.bulletPoints}>
                  <Text style={styles.bulletPoint}>• Age: 18 years and above</Text>
                  <Text style={styles.bulletPoint}>• Group size: 10-20 members</Text>
                  <Text style={styles.bulletPoint}>• Regular savings commitment</Text>
                  <Text style={styles.bulletPoint}>• Residence in same locality</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Benefits</Text>
                <View style={styles.bulletPoints}>
                  <Text style={styles.bulletPoint}>• Access to micro-credit</Text>
                  <Text style={styles.bulletPoint}>• Financial literacy training</Text>
                  <Text style={styles.bulletPoint}>• Collective bargaining power</Text>
                  <Text style={styles.bulletPoint}>• Social empowerment</Text>
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  infoButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '60%',
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalScroll: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  bulletPoints: {
    marginTop: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#666',
    lineHeight: 28,
  },
});

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface InputProps {
  onSendMessage: (message: string) => void;
}

export default function Input({ onSendMessage }: InputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  // Animation values
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const inputHeight = React.useRef(new Animated.Value(50)).current;

  // Pulse animation for voice button
  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleVoicePress = () => {
    setIsRecording(!isRecording);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Add voice recording logic here
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    Animated.timing(inputHeight, {
      toValue: Math.min(Math.max(50, height), 100),
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputSection}>
        {/* AI Assistant Icon */}
        <View style={styles.assistantIcon}>
          <MaterialCommunityIcons 
            name="robot" 
            size={20} 
            color="#7B68EE" 
          />
        </View>

        {/* Text Input */}
        <Animated.View style={[styles.inputWrapper, { height: inputHeight }]}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Ask me anything about finance..."
            placeholderTextColor="#666"
            multiline
            onContentSizeChange={handleContentSizeChange}
          />
          
          {/* Send Button */}
          {message.trim() && (
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSendMessage}
            >
              <MaterialCommunityIcons 
                name="send" 
                size={24} 
                color="#7B68EE" 
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {/* Voice Input Button */}
      <View style={styles.voiceSection}>
        <Text style={styles.voiceHint}>
          {isRecording ? 'Listening...' : 'Tap to use voice'}
        </Text>
        <TouchableOpacity
          onPress={handleVoicePress}
          style={styles.voiceButtonWrapper}
        >
          <Animated.View 
            style={[
              styles.voiceButton,
              { transform: [{ scale: pulseAnim }] },
              isRecording && styles.voiceButtonRecording,
            ]}
          >
            <MaterialCommunityIcons
              name={isRecording ? 'microphone' : 'microphone-outline'}
              size={28}
              color="#fff"
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  assistantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  voiceSection: {
    alignItems: 'center',
  },
  voiceHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  voiceButtonWrapper: {
    padding: 8,
  },
  voiceButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7B68EE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7B68EE',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceButtonRecording: {
    backgroundColor: '#FF4B4B',
  },
});

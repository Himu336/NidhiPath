import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import Suggestions from './suggestion';
import { sendQuery, uploadPDF } from '../../../scripts/chatbot';
import * as DocumentPicker from 'expo-document-picker';
import UploadProgress from './components/UploadProgress';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Financial Wingman. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ progress: number; fileName: string } | null>(null);

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      // Show typing indicator
      const typingMessage: Message = {
        id: 'typing',
        text: 'Typing...',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, typingMessage]);

      // Get response from API
      const response = await sendQuery(userMessage.text);

      // Remove typing indicator and add bot response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date(),
        }];
      });
    } catch (error) {
      console.error('Error getting bot response:', error);
      // Remove typing indicator and show error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          isUser: false,
          timestamp: new Date(),
        }];
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => {
    return (
      <Animated.View
        key={message.id}
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        {!message.isUser && (
          <View style={styles.botAvatar}>
            <MaterialCommunityIcons name="robot" size={24} color="#7B68EE" />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.botBubble
        ]}>
          <Text style={[
            styles.messageText,
            message.isUser ? styles.userText : styles.botText
          ]}>
            {message.text}
          </Text>
          <Text style={[
            styles.timestamp,
            message.isUser && styles.userTimestamp
          ]}>
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </Animated.View>
    );
  };

  // Add voice recording functions
  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    // Here you would typically send the audio file to your speech-to-text service
    // For now, let's simulate a response
    const simulatedText = "This is what I heard from your voice message";
    setInputText(simulatedText);
  }

  // Add text-to-speech function
  const speakMessage = async (text: string) => {
    try {
      await Speech.speak(text, {
        language: 'en',
        pitch: 1,
        rate: 0.9,
      });
    } catch (error) {
      console.error('Failed to speak message:', error);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setInputText(suggestion);
    // Optional: Automatically send the suggestion
    // handleSend();
  };

  const handleFileUpload = async () => {
    try {
      console.log('Starting file picker...');
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      console.log('Document picker result:', result);

      // Check for the new structure with assets array
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('Selected file details:', {
          name: file.name,
          size: file.size,
          uri: file.uri,
          mimeType: file.mimeType,
        });

        // Initialize upload progress
        setUploadProgress({ progress: 0, fileName: file.name });

        // Create form data
        const fileToUpload = {
          uri: file.uri,
          type: file.mimeType || 'application/pdf',
          name: file.name,
        };

        console.log('Preparing file upload:', fileToUpload);

        try {
          // Show uploading message
          const uploadingMessage: Message = {
            id: 'uploading',
            text: 'Uploading your document...',
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, uploadingMessage]);

          // Upload with progress
          console.log('Starting upload...');
          await uploadPDF(fileToUpload, (progress: number) => {
            console.log('Upload progress:', progress);
            setUploadProgress(prev => 
              prev ? { ...prev, progress } : { progress, fileName: file.name }
            );
          });
          console.log('Upload completed successfully');

          // Show success message
          setMessages(prev => {
            const filtered = prev.filter(msg => msg.id !== 'uploading');
            return [...filtered, {
              id: Date.now().toString(),
              text: 'Document uploaded successfully! You can now ask questions about it.',
              isUser: false,
              timestamp: new Date(),
            }];
          });
        } catch (error) {
          console.error('Upload error details:', {
            error,
            message: error.message,
            stack: error.stack,
          });
          setMessages(prev => {
            const filtered = prev.filter(msg => msg.id !== 'uploading');
            return [...filtered, {
              id: Date.now().toString(),
              text: 'Sorry, there was an error uploading your document. Please try again.',
              isUser: false,
              timestamp: new Date(),
            }];
          });
        } finally {
          setTimeout(() => {
            setUploadProgress(null);
            console.log('Upload progress cleared');
          }, 1000);
        }
      } else {
        console.log('File selection cancelled or no file selected');
      }
    } catch (error) {
      console.error('Document picker error details:', {
        error,
        message: error.message,
        stack: error.stack,
      });
      Alert.alert('Error', 'Could not access document picker');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={['#7B68EE', '#9B89FF']}
          style={styles.headerGradient}
        >
          <MaterialCommunityIcons name="robot" size={24} color="#FFF" />
          <Text style={styles.headerTitle}>Financial Assistant</Text>
        </LinearGradient>
      </View>

      <View style={styles.chatBackground}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        >
          {messages.length === 1 && <Suggestions onSelect={handleSuggestionSelect} />}
          {messages.map(renderMessage)}
          {uploadProgress && (
            <UploadProgress 
              progress={uploadProgress.progress}
              fileName={uploadProgress.fileName}
            />
          )}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity
            style={[styles.actionButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <MaterialCommunityIcons 
              name={isRecording ? "stop-circle" : "microphone"} 
              size={24} 
              color={isRecording ? "#FF4444" : "#7B68EE"} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFileUpload}
          >
            <MaterialCommunityIcons 
              name="file-upload" 
              size={24} 
              color="#7B68EE" 
            />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            multiline
          />
          
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <MaterialCommunityIcons 
              name="send" 
              size={24} 
              color={inputText.trim() ? "#7B68EE" : "#CCC"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 60,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  chatBackground: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    backgroundImage: 'linear-gradient(rgba(123, 104, 238, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 104, 238, 0.05) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    opacity: 0.98,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userBubble: {
    backgroundColor: '#7B68EE',
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  botBubble: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFF',
  },
  botText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
    opacity: 0.7,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    padding: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  recordingButton: {
    backgroundColor: '#FFE5E5',
  },
  typingIndicator: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
});

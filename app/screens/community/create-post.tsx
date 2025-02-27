import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CreatePostProps {
  onPost: (content: string, tags: string[]) => void;
}

export default function CreatePost({ onPost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const suggestions = [
    "Share a financial win 🎉",
    "Ask for budgeting advice 💡",
    "Discuss investment strategies 📈",
    "Share savings tips 💰",
    "Tell us your money goals 🎯",
  ];

  const tags = [
    { name: 'Budgeting', icon: 'calculator' },
    { name: 'Investing', icon: 'chart-line' },
    { name: 'Savings', icon: 'piggy-bank' },
    { name: 'Tips', icon: 'lightbulb' },
    { name: 'Discussion', icon: 'forum' },
  ];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePost = () => {
    if (content.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
        }),
      ]).start(() => {
        onPost(content, selectedTags);
        setContent('');
        setSelectedTags([]);
      });
    }
  };

  const toggleTag = (tag: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FF']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Share Your Thoughts</Text>
              <Text style={styles.subtitle}>Connect with the financial community</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                multiline
                placeholder={suggestions[Math.floor(Math.random() * suggestions.length)]}
                placeholderTextColor="#94A3B8"
                value={content}
                onChangeText={setContent}
                maxLength={500}
              />
            </View>

            <View style={styles.tagsContainer}>
              <Text style={styles.tagsTitle}>Topics</Text>
              <View style={styles.tagsList}>
                {tags.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => toggleTag(tag.name)}
                    style={[
                      styles.tag,
                      selectedTags.includes(tag.name) && styles.tagSelected,
                    ]}
                  >
                    <MaterialCommunityIcons 
                      name={tag.icon as any} 
                      size={18} 
                      color={selectedTags.includes(tag.name) ? '#fff' : '#64748B'} 
                    />
                    <Text 
                      style={[
                        styles.tagText,
                        selectedTags.includes(tag.name) && styles.tagTextSelected,
                      ]}
                    >
                      {tag.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.counter}>
                {content.length}/500
              </Text>
              <TouchableOpacity
                style={[
                  styles.postButton,
                  !content.trim() && styles.postButtonDisabled,
                ]}
                onPress={handlePost}
                disabled={!content.trim()}
              >
                <LinearGradient
                  colors={content.trim() ? ['#7B68EE', '#9B89FF'] : ['#E2E8F0', '#E2E8F0']}
                  style={styles.postButtonGradient}
                >
                  <Text style={styles.postButtonText}>Share</Text>
                  <MaterialCommunityIcons 
                    name="send" 
                    size={20} 
                    color="#fff" 
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    fontSize: 16,
    color: '#1E293B',
    minHeight: 100,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagSelected: {
    backgroundColor: '#7B68EE',
    borderColor: '#7B68EE',
  },
  tagText: {
    fontSize: 15,
    color: '#64748B',
    marginLeft: 8,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  counter: {
    fontSize: 14,
    color: '#64748B',
  },
  postButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  postButtonDisabled: {
    opacity: 0.7,
  },
  postButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 6,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

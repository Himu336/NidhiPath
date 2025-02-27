import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
}

interface CommunityFeedProps {
  ListHeaderComponent?: React.ReactNode;
}

export default function CommunityFeed({ ListHeaderComponent }: CommunityFeedProps) {
  const [posts, setPosts] = useState<Array<Post>>([
    {
      id: '1',
      author: {
        name: 'Sarah Chen',
        avatar: 'https://example.com/avatar1.jpg',
      },
      content: 'Just achieved my first savings goal! 🎉 Started with small steps, consistently saved 20% of my income, and now I have hit my emergency fund target. Remember: every small step counts! #SavingsGoals #FinancialSuccess',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 5,
      tags: ['Savings', 'Success Story'],
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: '2',
      author: {
        name: 'Michael Rodriguez',
        avatar: 'https://example.com/avatar2.jpg',
      },
      content: 'Question for the community: Whats your preferred method for tracking daily expenses? Looking for efficient ways to monitor spending habits. #Budgeting',
      timestamp: '4 hours ago',
      likes: 18,
      comments: 12,
      tags: ['Budgeting', 'Question'],
      isLiked: true,
      isBookmarked: true,
    },
  ]);

  const handleLike = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked,
        };
      }
      return post;
    }));
  };

  const PostCard = ({ post }: { post: Post }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const animatePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <Animated.View style={[styles.postCard, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons 
                name="account-circle" 
                size={40} 
                color="#7B68EE" 
              />
            </View>
            <View>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <Text style={styles.timestamp}>{post.timestamp}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleBookmark(post.id)}
            style={styles.bookmarkButton}
          >
            <MaterialCommunityIcons 
              name={post.isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={post.isBookmarked ? "#7B68EE" : "#666"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.content}>{post.content}</Text>

        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              animatePress();
              handleLike(post.id);
            }}
          >
            <MaterialCommunityIcons 
              name={post.isLiked ? "heart" : "heart-outline"}
              size={24}
              color={post.isLiked ? "#FF4B4B" : "#666"}
            />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons 
              name="comment-outline"
              size={24}
              color="#666"
            />
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons 
              name="share-outline"
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feedContainer: {
    padding: 16,
    gap: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  bookmarkButton: {
    padding: 4,
  },
  content: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F8F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#7B68EE',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
});

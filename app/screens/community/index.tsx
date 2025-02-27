import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import MentorConnect from './mentor-connect';
import CreatePost from './create-post';
import CommunityFeed from './community-feed';

export default function CommunityScreen() {
  const handlePost = (content: string, tags: string[]) => {
    // Handle the new post
    console.log('New post:', { content, tags });
    // Here you would typically:
    // 1. Send to backend
    // 2. Update local state
    // 3. Show success message
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect, Share & Learn</Text>
      </View>

      <View style={styles.container}>
        <MentorConnect />
        
        <View style={styles.sectionDivider} />
        
        <CreatePost onPost={handlePost} />
        
        <View style={styles.sectionDivider} />
        
        <View style={styles.feedHeader}>
          <Text style={styles.feedTitle}>Explore Success Stories</Text>
          <Text style={styles.feedSubtitle}>Learn from community experiences</Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <CommunityFeed ListHeaderComponent={renderHeader()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    backgroundColor: '#fff',
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F8F8F8',
    marginVertical: 16,
  },
  feedHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  feedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  feedSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

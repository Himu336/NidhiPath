import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MentorStory {
  id: string;
  name: string;
  title: string;
  tagline: string;
  story: string;
  image: string;
  expertise: string[];
  experience: string;
}

export default function MentorConnect() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  const mentors: MentorStory[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Fintech Entrepreneur',
      tagline: 'From startup to $10M in 2 years',
      story: 'Built a revolutionary financial app that helps young professionals manage their investments. Started with just an idea and a small team, now serving over 100,000 users.',
      image: 'https://example.com/sarah.jpg',
      expertise: ['Investment', 'Startup Growth', 'Tech Innovation'],
      experience: '8 years',
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      title: 'Investment Advisor',
      tagline: 'Helping 1000+ families build wealth',
      story: 'Specialized in creating sustainable wealth management strategies for middle-income families. Passionate about financial education and community empowerment.',
      image: 'https://example.com/michael.jpg',
      expertise: ['Wealth Management', 'Financial Planning', 'Education'],
      experience: '12 years',
    },
  ];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const MentorCard = ({ mentor }: { mentor: MentorStory }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handleConnect = () => {
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
      ]).start();
      // Handle connect action
      console.log('Connecting with', mentor.name);
    };

    return (
      <Animated.View 
        style={[
          styles.card,
          { transform: [{ scale: scaleAnim }], width: screenWidth - 32 }
        ]}
      >
        <LinearGradient
          colors={['#F8F0FF', '#FFF']}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.profileSection}>
              <View style={styles.imageContainer}>
                <MaterialCommunityIcons 
                  name="account-circle" 
                  size={80} 
                  color="#7B68EE" 
                />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.name}>{mentor.name}</Text>
                <Text style={styles.title}>{mentor.title}</Text>
                <View style={styles.experienceTag}>
                  <MaterialCommunityIcons 
                    name="briefcase-outline" 
                    size={16} 
                    color="#7B68EE" 
                  />
                  <Text style={styles.experienceText}>{mentor.experience}</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.tagline}>{mentor.tagline}</Text>
          <Text style={styles.story}>{mentor.story}</Text>

          <View style={styles.expertiseContainer}>
            {mentor.expertise.map((skill, index) => (
              <View key={index} style={styles.expertiseTag}>
                <Text style={styles.expertiseText}>{skill}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnect}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons 
              name="handshake" 
              size={24} 
              color="#FFF" 
            />
            <Text style={styles.connectText}>Connect & Learn</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons 
          name="star-circle" 
          size={28} 
          color="#7B68EE" 
        />
        <Text style={styles.headerText}>Success Stories</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / (screenWidth - 32));
          setActiveIndex(newIndex);
        }}
      >
        {mentors.map((mentor, index) => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {mentors.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginLeft: 12,
  },
  card: {
    margin: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 20,
  },
  cardHeader: {
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  experienceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F0FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  experienceText: {
    marginLeft: 4,
    color: '#7B68EE',
    fontWeight: '600',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  story: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  expertiseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  expertiseTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  expertiseText: {
    color: '#666',
    fontSize: 14,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7B68EE',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#7B68EE',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  connectText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#7B68EE',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

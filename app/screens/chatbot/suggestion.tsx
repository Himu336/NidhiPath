import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface SuggestionProps {
  onSelect: (suggestion: string) => void;
}

const suggestions = [
  {
    text: "How to save money?",
    icon: "piggy-bank",
  },
  {
    text: "Investment advice",
    icon: "chart-line",
  },
  {
    text: "Budgeting tips",
    icon: "calculator",
  },
  {
    text: "Debt management",
    icon: "credit-card",
  },
  {
    text: "Emergency fund",
    icon: "shield",
  },
];

export default function Suggestions({ onSelect }: SuggestionProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const categories = [
    {
      title: "Investment",
      questions: [
        {
          question: "How to start\ninvesting?",
          icon: "chart-line-variant",
          colors: ['#7B68EE', '#9B89FF'],
        },
        {
          question: "Stock market\nbasics",
          icon: "trending-up",
          colors: ['#6C5CE7', '#81A1F8'],
        },
      ],
    },
    {
      title: "Savings",
      questions: [
        {
          question: "Best savings strategies for beginners",
          icon: "piggy-bank",
          colors: ['#FF7F50', '#FFA07A'],
        },
        {
          question: "How to build emergency funds?",
          icon: "shield-check",
          colors: ['#FF6B6B', '#FF8787'],
        },
      ],
    },
    {
      title: "Budgeting",
      questions: [
        {
          question: "Create a monthly budget plan",
          icon: "calendar-check",
          colors: ['#4CAF50', '#81C784'],
        },
        {
          question: "Tips to reduce monthly expenses",
          icon: "cash-minus",
          colors: ['#20B2AA', '#48D1CC'],
        },
      ],
    },
  ];

  const QuestionCard = ({ 
    question, 
    icon, 
    colors 
  }: { 
    question: string; 
    icon: string; 
    colors: string[];
  }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePress = () => {
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
      ]).start(() => onSelect(question));
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.cardContainer}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name={icon as keyof typeof MaterialCommunityIcons.glyphMap} 
                size={28} 
                color="#fff" 
              />
            </View>
            <Text style={styles.questionText}>{question}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const CategorySection = ({ title, questions }: { title: string; questions: any[] }) => (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <View style={styles.cardsGrid}>
        {questions.map((item, index) => (
          <QuestionCard 
            key={index}
            question={item.question}
            icon={item.icon}
            colors={item.colors}
          />
        ))}
      </View>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons 
            name="lightbulb-on" 
            size={28} 
            color="#7B68EE" 
          />
          <Text style={styles.headerText}>Suggested Questions</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(suggestion.text)}
            style={styles.suggestionWrapper}
          >
            <LinearGradient
              colors={['#7B68EE15', '#9B89FF15']}
              style={styles.suggestion}
            >
              <MaterialCommunityIcons 
                name={suggestion.icon} 
                size={24} 
                color="#7B68EE" 
              />
              <Text style={styles.suggestionText}>{suggestion.text}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category, index) => (
          <CategorySection 
            key={index}
            title={category.title}
            questions={category.questions}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginLeft: 12,
  },
  scrollContent: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginLeft: 4,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
    aspectRatio: 1,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    height: '100%',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 22,
    marginTop: 12,
  },
  suggestionWrapper: {
    marginRight: 12,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7B68EE20',
  },
  suggestionText: {
    marginLeft: 8,
    color: '#7B68EE',
    fontSize: 14,
    fontWeight: '500',
  },
});

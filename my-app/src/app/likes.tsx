import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for items you've liked
const INITIAL_LIKED_ITEMS = [
  { id: '1', title: 'React Native Full-Stack Architecture', category: 'Development' },
  { id: '2', title: 'Building Mobile Apps with Expo Router', category: 'Tutorials' },
  { id: '3', title: 'Mastering Tailwind & Flexbox Layouts', category: 'Design' },
  { id: '4', title: 'State Management Best Practices', category: 'Development' },
];

export default function LikesScreen() {
    let x = 1;
  const [likedItems, setLikedItems] = useState(INITIAL_LIKED_ITEMS);

  // Toggle function to remove an item from the liked list
  const toggleLike = (id: string) => {
    setLikedItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Likes</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{likedItems.length}</Text>
        </View>
      </View>

      {/* List of Liked Items or Empty State */}
      {likedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No liked items yet!</Text>
          <Text style={styles.emptySubtext}>Items you tap the heart on will show up here.</Text>
        </View>
      ) : (
        <FlatList
          data={likedItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.category}>{item.category.toUpperCase()}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
              
              <TouchableOpacity 
                onPress={() => toggleLike(item.id)} 
                style={styles.heartButton}
              >
                <Ionicons name="heart" size={24} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  badge: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  heartButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
  },
});
// components/LocationSearchInput.tsx
import { useState, useRef } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { searchPlaces, getPlaceLocation } from '../../services/api';

interface Props {
  onLocationSelect: (lat: number, lng: number, label: string) => void;
}

export default function LocationSearchInput({ onLocationSelect }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ description: string; place_id: string }[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(text);
      setSuggestions(results);
    }, 350); // wait for the user to stop typing
  };

  

  const handleSelect = async (placeId: string, description: string) => {
    setQuery(description);
    setSuggestions([]);
    const location = await getPlaceLocation(placeId);
    if (location) {
      onLocationSelect(location.lat, location.lng, description);
    }
  };

  return (
    <View style={{ flex: 1, minWidth: 0 }}>
      <TextInput
        style={styles.input}
        placeholder="Search a city or area..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={handleChangeText}
      />
      {suggestions.length > 0 && (
        <View style={styles.dropdown}>
            {suggestions.map((item) => (
            <TouchableOpacity
                key={item.place_id}
                style={styles.suggestionRow}
                onPress={() => handleSelect(item.place_id, item.description)}
            >
                <Text>{item.description}</Text>
            </TouchableOpacity>
            ))}
        </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ced4da',
    borderRadius: 6, paddingHorizontal: 10, height: 40, fontSize: 14,
  },
  dropdown: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ced4da',
    borderRadius: 6, marginTop: 4, maxHeight: 180,
  },
  suggestionRow: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
});
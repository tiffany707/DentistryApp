import { Key } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, TextInputBase, TextInput, Touchable } from 'react-native';
import { applyToJob } from '../../services/api'
import { Ionicons } from '@expo/vector-icons';

interface Props{
    professionalId: string;
    shiftId: Key;
    title: string;
    date: string | Date;
    startTime: string;
    endTime: string;
    skillsRequired: string[];
    address: string;
}

export default function ShiftCard({professionalId, shiftId, title, date, startTime, endTime, skillsRequired, address}: Props) {
    const skillsList = skillsRequired.join(", ")

    const formattedDate = typeof date === "string" 
    ? date.split("-T")[0].split("T")[0] // handles both "-T" and "T"
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return(
        <View key={shiftId} style={styles.card}>
      <Text style={styles.header}>{title}</Text>

      {/* Address Row */}
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.text}>{address}</Text>
      </View>

      {/* Date Row */}
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#666" />
        <Text style={styles.text}>{formattedDate}</Text>
      </View>

      {/* Time Row */}
      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.text}>{startTime} - {endTime}</Text>
      </View>

      {/* Skills Row */}
      <View style={styles.infoRow}>
        <Ionicons name="construct-outline" size={16} color="#666" />
        <Text style={styles.text}>Skills: {skillsList}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => { applyToJob(shiftId, professionalId) }}>
        <Text style={styles.buttonText}>Apply Now</Text>
      </TouchableOpacity>
    </View>
    )

} 

    const styles = StyleSheet.create({
        text: { fontSize: 14, marginBottom: 5 },
        header: { fontSize: 16, marginBottom: 5,  fontWeight: "bold" },
        card: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, marginBottom: 15 },
        button: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
        buttonText: { color: '#fff', fontWeight: 'bold' },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,              // Space between icon and text
            marginBottom: 6,
        },
    })
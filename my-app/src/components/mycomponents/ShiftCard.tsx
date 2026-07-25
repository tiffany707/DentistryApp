import { Key } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, TextInputBase, TextInput, Touchable } from 'react-native';
import { applyToJob } from '../../services/api'

interface Props{
    professionalId: string;
    shiftId: Key;
    clinicName: string;
    date: string | Date;
    startTime: string;
    endTime: string;
    skillsRequired: string[];
}

export default function ShiftCard({professionalId, shiftId, clinicName, date, startTime, endTime, skillsRequired}: Props) {
    const skillsList = skillsRequired.join(", ")

    const formattedDate = typeof date === "string" 
    ? date.split("-T")[0].split("T")[0] // handles both "-T" and "T"
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return(
        <View key={shiftId} style={styles.card}>
            <Text style={styles.header}>{`${clinicName}`}</Text>
            <Text style={styles.text}>{`Date: ${formattedDate}`}</Text>
            <Text style={styles.text}>{`Time: ${startTime} - ${endTime}`}</Text>
            <Text style={styles.text}>{`Skills Required: ${skillsList}`}</Text>
            <TouchableOpacity style={styles.button} onPress={() => {applyToJob(shiftId, professionalId)}}>
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
            buttonText: { color: '#fff', fontWeight: 'bold' }
    })
import { Ionicons } from '@expo/vector-icons';
import { Key, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { applyToJob } from '../../services/api';

interface Props {
    professionalId: string;
    shiftId: Key;
    title: string;
    date: string | Date;
    startTime: string;
    endTime: string;
    skillsRequired: string[];
    address: string;
    onApplySuccess?: () => void;
}

export default function ShiftCard({
    professionalId, shiftId, title, date, startTime, endTime,
    skillsRequired, address, onApplySuccess
}: Props) {
    const [applying, setApplying] = useState(false);
    const skillsList = skillsRequired.join(", ");

    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Added timeZone: 'UTC' to keep the date locked to the correct day regardless of device location
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',   
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    });

    function formatTime(time: string | Date, timeZone: string = 'America/Edmonton') {
        const timeObj = typeof time === "string" ? new Date(time) : time;

        return timeObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone,
        });
    }

    const handleApply = async () => {
        try {
            console.log("applying...")
            setApplying(true);
            await applyToJob(professionalId, shiftId);
            console.log("applied")
            onApplySuccess?.();
        } catch (err) {
            alert('Could not apply to this shift. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    return (
        <View key={shiftId} style={styles.card}>
            <Text style={styles.header}>{title}</Text>

            <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.text}>{address}</Text>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.text}>{formattedDate}</Text>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.text}>{formatTime(startTime)} - {formatTime(endTime)}</Text>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="construct-outline" size={16} color="#666" />
                <Text style={styles.text}>Skills: {skillsList}</Text>
            </View>

            <TouchableOpacity
                style={[styles.button, applying && styles.buttonDisabled]}
                onPress={handleApply}
                disabled={applying}
            >
                {applying
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Text style={styles.buttonText}>Apply Now</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    text: { fontSize: 14, marginBottom: 5, flex: 1 },
    header: { fontSize: 16, marginBottom: 5, fontWeight: "bold" },
    card: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 30, marginBottom: 15 },
    button: { backgroundColor: '#C4B3C5', padding: 10, borderRadius: 20, alignItems: 'center', marginTop: 10 },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
});
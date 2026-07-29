import { getNearbyShifts } from '@/services/api';
import * as Location from 'expo-location';
import { Key, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationSearchInput from './LocationSearchInput';
import ShiftCard from './ShiftCard';

interface Shift {
    professionalId: string;
    _id: Key;
    title: string;
    date: string | Date;
    startTime: string;
    endTime: string;
    skillsRequired: string[];
    status: string;
    address: string;
}

export default function ShiftFeed(){
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Manual input states
    const [latInput, setLatInput] = useState("");
    const [lngInput, setLngInput] = useState("");
    const [distanceInput, setDistanceInput] = useState("15000");

    async function fetchShifts(lat: number, lng: number, distance: number) {
        try {
            setLoading(true);
            setError("");
            const data = await getNearbyShifts(lng, lat, distance);
            setShifts(data.shifts || []);
        } catch(err) {
            setError('Could not fetch nearby shifts.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        async function initLocationAndFetch(){
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
            
                if(status !== "granted"){
                    setLoading(false);
                    setError("Permission to access location was denied.");
                    return;
                }

                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.LocationAccuracy.Balanced,
                });
                const lat = location.coords.latitude;
                const lng = location.coords.longitude;

                // Populate input fields with current GPS as defaults
                setLatInput(lat.toString());
                setLngInput(lng.toString());

                await fetchShifts(lat, lng, Number(distanceInput) || 15000);
            } catch(err) {
                setError('Could not get current location.');
                setLoading(false);
            }
        }

        initLocationAndFetch();
    }, []);

    const handleManualSearch = () => {
        const lat = parseFloat(latInput);
        const lng = parseFloat(lngInput);
        const distance = parseFloat(distanceInput);

        if (isNaN(lat) || isNaN(lng)) {
            alert("Please enter valid latitude and longitude coordinates.");
            return;
        }

        fetchShifts(lat, lng, isNaN(distance) ? 15000 : distance);
    };

    // Quick presets handler
    const selectPresetLocation = (lat: string, lng: string) => {
        setLatInput(lat);
        setLngInput(lng);
        fetchShifts(parseFloat(lat), parseFloat(lng), parseFloat(distanceInput) || 15000);
    };

    if (loading && shifts.length === 0) return <ActivityIndicator size="large" style={styles.centered} />;
    if (error && shifts.length === 0) return <Text style={styles.errorText}>{error}</Text>;
    
    return(
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* The Manual Location & Distance Input Bar */}
                <View style={styles.searchContainer}>
                    <Text style={styles.filterTitle}>Filter Search Location</Text>
                    
                    <View style={styles.searchBar}>
                        <LocationSearchInput
                            onLocationSelect={(lat, lng, label) => {
                                setLatInput(lat.toString());
                                setLngInput(lng.toString());
                                fetchShifts(lat, lng, parseFloat(distanceInput) || 15000);
                            }}
                        />

                        <TouchableOpacity style={styles.searchButton} onPress={handleManualSearch}>
                            <Text style={styles.searchButtonText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                  
                </View>

                {/* The Shifts List */}
                <View style={styles.listContainer}>
                    <Text style={styles.header}>Available Shifts Near You</Text>
                    
                    {loading ? (
                        <ActivityIndicator size="small" style={{ marginTop: 20 }} />
                    ) : shifts.length === 0 ? (
                        <Text style={styles.centered}>No open shifts found nearby.</Text>
                    ) : (
                        shifts.map(shift => (
                            <ShiftCard 
                                key={shift._id?.toString()} 
                                professionalId={shift.professionalId} 
                                shiftId={shift._id} 
                                title={shift.title} 
                                date={shift.date} 
                                startTime={shift.startTime} 
                                endTime={shift.endTime} 
                                skillsRequired={shift.skillsRequired} 
                                address={shift.address}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 16 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    errorText: { color: 'red', textAlign: 'center', marginTop: 50 },
    
    searchContainer: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
        width: '100%',
        overflow: 'hidden', // <-- 1. This stops anything from spilling outside the box boundaries
    },
    filterTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
    presetRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    presetButton: {
        backgroundColor: '#e2e8f0',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    presetButtonText: { fontSize: 12, color: '#334155', fontWeight: '500' },
    inputRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 6,
        paddingHorizontal: 10,
        height: 40,
        fontSize: 14
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        flexShrink: 1, // <-- 2. Allows the row to shrink to fit the parent container instead of forcing overflow
    },
    searchButton: {
        backgroundColor: '#C4B3C5',
        paddingHorizontal: 16,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        flexShrink: 0, // <-- 3. Keeps the button from getting squished
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContainer: { flex: 1 }
});
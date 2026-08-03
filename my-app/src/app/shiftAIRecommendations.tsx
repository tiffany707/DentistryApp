
import ShiftRecommendation from '@/components/mycomponents/ShiftAI/ShiftRecommendation';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

export default function ShiftCreationScreen() {
        const { shiftId } = useLocalSearchParams<{ shiftId: string }>();

    return (
        <SafeAreaView style={styles.container}>
            <ShiftRecommendation key={shiftId} shiftId={shiftId} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
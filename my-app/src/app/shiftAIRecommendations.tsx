
import ShiftRecommendation from '@/components/mycomponents/ShiftAI/ShiftRecommendation';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShiftCreationScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ShiftRecommendation shiftId={'6a64759bffc261206aa24ab1'}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
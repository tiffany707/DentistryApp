
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import ShiftCreation from '@/components/mycomponents/ShiftCreation';

export default function ShiftCreationScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ShiftCreation />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
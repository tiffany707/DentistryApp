import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import ShiftFeed from '../components/mycomponents/ShiftFeed';

export default function ShiftFeedScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ShiftFeed />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Props {
    name: string;
    skills: string[];
    profilePicture: string;
    title:string
}

export default function ProfessionalCard({ name, skills, profilePicture, title }: Props) {
    const skillsList = skills.join(', ');

    return (
        <View style={styles.card}>
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
            <View style={styles.profile}>
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.skills}>Skills: {skillsList}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity>
                        <Text style={styles.viewProfile}>View Profile</Text>
                    </TouchableOpacity>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity>
                            <Ionicons name="paper-plane-outline" size={32} color="#FFFFFF" style={{ marginTop: 3, marginRight: 1}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: '#ccc',
        borderRadius: 30,
        backgroundColor: '#EFEFFB',
        padding: 12,
        marginBottom: 20,
        marginHorizontal: 12,
    },
    profile:{
        flex: 1,
        flexDirection: 'column',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        marginRight: 12,
        overflow: 'hidden', 
    },
    info: {
        flex: 1,
        marginBottom: 12
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    title: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
        marginBottom: 4,
    },
    skills: {
        fontSize: 14,
        color: '#666',
        flexWrap: 'wrap',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    viewProfile: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
        padding: 18,
        backgroundColor: '#C4B3C5',
        borderRadius: 24
    },
    iconContainer:{
        width: 50,
        height: 50,
        borderRadius: 25, // Makes it a circle (half of width/height)
        borderColor: '#ccc', // Color of the border
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#C4B3C5',
    }
});

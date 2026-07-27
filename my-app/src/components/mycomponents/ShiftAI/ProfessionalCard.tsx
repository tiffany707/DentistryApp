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
                    <TouchableOpacity>
                        <Ionicons name="paper-plane-outline" size={16} color="#666" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    profile:{
        flex: 1,
        flexDirection: 'column',
    },
    profilePicture: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        overflow: 'hidden', 
    }
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
        color: '#D3D3D3',
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
        color: '#4CAF50',
        fontWeight: '600',
    },
});

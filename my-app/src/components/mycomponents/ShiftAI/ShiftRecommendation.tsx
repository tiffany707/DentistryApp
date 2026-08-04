import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    View
} from 'react-native';
import ProfessionalCard from './ProfessionalCard';


interface Professional {
    id: string;
    name: string;
    skills: string[];
    profilePicture: string;
    title: string
}

interface Props{
    shiftId: string;
}
export default function ShiftRecommendation({shiftId} : Props) {
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        async function fetchRecommendations(){
            setLoading(true);
            setProfessionals([]);
            console.log("fetching candidates")
            try{
                const res = await fetch(`http://192.168.151.93:5000/api/ai/recommendations?shiftId=${shiftId}`);
                const data = await res.json();

                if(!res.ok){
                    console.log("Backend candidate fetching error:", data.error || data.message || data);
                    throw new Error("There was an error fetching your recommendations")
                }
                setProfessionals(data.matchedCandidates as Professional[]);
                console.log(data)
            }
            catch(err){
                
            }
            finally{
                setLoading(false);
            }
        }
        fetchRecommendations();
    
    }, [shiftId]);

    if(loading){
        return(
            <View style={{ flex: 1, padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center'  }}>Recommended Professionals</Text>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#C4B3C5" />
                    <Text style={{ marginTop: 10 }}>AI is looking for the best matches...</Text>
                </View>
            </View>
        )
    }

    return(
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center'  }}>Recommended Professionals</Text>
            <Text></Text>
            <FlatList
                data={professionals}
                keyExtractor={(item) => item.id} 
                renderItem={({ item }) => (
                    <ProfessionalCard 
                        name={item.name} 
                        title={item.title}
                        skills={item.skills} 
                        profilePicture={item.profilePicture} 
                    />
                )}
            />
        </View>
    )
}
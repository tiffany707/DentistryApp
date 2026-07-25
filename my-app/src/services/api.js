
const API_URL ="http://localhost:5000"

//to get nearby shifts
export async function getNearbyShifts(lng, lat, maxDistance=15000){
    try{
        const res = await fetch(`${API_URL}/api/shifts/nearby?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`);


        if(!res.ok){
            throw new error("There was something wrong with the fetch");
        }

         const data = await res.json()

        if(data.count == 0){
            return {message: "There are no shifts nearby.", count: 0, shifts: []}
        }
        else{
            return ({message: `There are ${data.count} shifts nearby`, shifts: data.shifts});
        }
    }
    catch(err){
        console.error({error: err.message});
        return({message: err.message, count: 0, shifts: []})
    }
    
}


export async function applyToJob(professionalId, shiftId){
    try{
        const res = await fetch(`${API_URL}/api/shifts/${shiftId}/apply`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ professionalId }),
            });

        const data = await res.json();

        if(!res.ok){
            throw new error( data.error || "Failed to apply");
        }

        return { success: true, data}

        if(data.error){
            return {
                success: false, error: err.message
            }
        }

    }
    catch(err){
        return {error: err.message};
    }
}
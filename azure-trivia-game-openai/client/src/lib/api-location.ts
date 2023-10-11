const API_URL = import.meta.env.VITE_SERVER_BASE_URL;  
   
const fetchLocation = async (lat, long) => {  

  if(!lat || !long) throw new Error('Error fetching location');

    const apiUrl = `${API_URL}/api/location`
    console.log(apiUrl)

    console.log(`location: ${location}`)

  const response = await fetch(apiUrl, {  
    method: 'POST',  
    headers: {  
      'Content-Type': 'application/json'  
    },  
    body: JSON.stringify({  
      'lat': lat, 'long': long
    })  
  });  
    
  if (!response.ok) {  
    console.log(`Error fetching game: ${response.statusText}`);
    throw new Error('Error fetching game');  
  }  
    
  const game = await response.json();  
  console.log(`game: ${JSON.stringify(game)}`)
  return game;  
};  
  
export default fetchLocation;  

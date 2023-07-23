const API_URL = import.meta.env.VITE_SERVER_BASE_URL;  
  
const fetchGame = async ({location}:{location:string}) => {  

    const apiUrl = `${API_URL}/api/game`
    console.log(apiUrl)

    console.log(`location: ${location}`)

  const response = await fetch(apiUrl, {  
    method: 'POST',  
    headers: {  
      'Content-Type': 'application/json'  
    },  
    body: JSON.stringify({  
      userText: location
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
  
export default fetchGame;  

  
const Geolocation = ({location, locationNames}) => {  
  
    const haveLocationNames = locationNames && (locationNames.city || locationNames.county || locationNames.state);

  return (  
    <div>  
      <h2>Current Location:</h2>  
      {location && !haveLocationNames && 
        <div>  
          <p>Latitude: {location.coords.latitude}</p>  
          <p>Longitude: {location.coords.longitude}</p>  
        </div>  
      }
      { haveLocationNames &&
        <div>  
          <p>City: {locationNames.city}</p>  
          <p>County: {locationNames.county}</p>  
          <p>State: {locationNames.state}</p>  
        </div>  
      }   
    </div>  
  );  
};  
  
export default Geolocation;  

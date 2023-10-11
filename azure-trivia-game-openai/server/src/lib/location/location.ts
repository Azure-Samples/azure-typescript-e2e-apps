import { StartupData } from './../startup/startup';
import fetch from 'node-fetch';

export type Location = {
  city: string;
  state: string;
  county: string;
};
export type LocationResponse = {
  status: number;
  error: string;
  data: Location | null;
}

const getLocation = async (latitude: number, longitude: number, StartupData): Promise<LocationResponse> => {



  const URL = `${StartupData.azureMapsBaseUrl}?api-version=1.0&subscription-key=${StartupData.azureMapsApiKey}&query=${latitude},${longitude}&typeahead=true&language=en-US&countrySet=US`
  console.log(URL);

  const response = await fetch(URL, { method: 'GET' });

  if (!response.ok) {
    return {
      status: response.status,
      error: response.statusText,
      data: null
    }
  }

  const data = await response.json()

  console.log(JSON.stringify(data));

  if (data?.addresses && data?.addresses.length !== 0) {

    const location: Location = {
      city: data.addresses[0].address.municipality,
      county: data.addresses[0].address.countrySecondarySubdivision,
      state: data.addresses[0].address.countrySubdivision,
    };


    return {
      status: response.status,
      error: undefined,
      data: location
    };
  }

  return {
    status: response.status,
    error: 'No location found',
    data: null
  };
}

export default getLocation;  

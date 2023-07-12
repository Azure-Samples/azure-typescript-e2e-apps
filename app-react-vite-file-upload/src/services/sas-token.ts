import axios from 'axios';

const request = axios.create({
  baseURL: '',
  headers: {
    'Content-type': 'application/json'
  }
});

export type sasTokenObjectResponse = {
  error: Error | unknown | undefined, 
  sasUrls: string[] | undefined
}

class SasTokenService {

  async getSasTokens(fileNames: string[]): Promise<sasTokenObjectResponse> {

    // const responseObj: sasTokenObjectResponse = {
    //   error: undefined,
    //   sasUrls: undefined
    // }

    try{
      const response = await request.post('/api/sas', { files: fileNames }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const sasUrls: string[] = response?.data as string[];
      return { error: undefined, sasUrls }
    } catch(error){
      return { error, sasUrls: undefined };
    }
  }
}

export default new SasTokenService();

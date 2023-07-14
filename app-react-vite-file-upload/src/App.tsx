// @ts-nocheck

import { useState, ChangeEvent } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { BlockBlobClient } from '@azure/storage-blob';
import ErrorBoundary from './components/error-boundary';

import axios from 'axios';

const request = axios.create({
  baseURL: '',
  headers: {
    'Content-type': 'application/json'
  }
});

import sasTokenService from './services/sas-token';
const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

// type SasTokenUrlInfoResponse = {
//   fileName:string,
//   sasTokenUrl: string
// }

// type SasInfoTypeResponse = {
//   error?: any,
//   sasUrls?: SasTokenUrlInfoResponse[]
// }

type SelectedFilesType = {
  [key: string]: File;
};

function App() {
  const [text, setText] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<SelectedFilesType>({});
  const [selectedFileArrayBuffer, setSelectedFileArrayBuffer] = useState<
    ArrayBuffer | undefined
  >(undefined);
  const [sasTokenUrl, setSasTokenUrl] = useState<string>('');

  const handleFileSelection = (event) => {
    setSelectedFile(event?.target?.files[0]);
    setStatus('File selected');
  };

  const handleFileRead = () => {
    if (selectedFile && selectedFile.name) {
      const reader = new FileReader();

      reader.onload = () => {
        const arrayBuffer = reader.result;
        setStatus('File read');
        setSelectedFileArrayBuffer(arrayBuffer as ArrayBuffer);

        // convert to text to see what was there
        const text = new TextDecoder('utf-8').decode(
          arrayBuffer as ArrayBuffer
        );
        setText(text);

        // Use the array buffer (e.g., perform further processing or send to server)
        console.log(text);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleFileSasToken = () => {

    // timestamp
    const timestamp = new Date().getTime();
    const containerName = `upload-${timestamp}`;
    const permission = 'w'; //write
    const timerange = 5; //minutes

    request.post(`http://localhost:7071/api/sas?file=${encodeURIComponent(selectedFile.name)}&permission=${permission}&container=${containerName}&timerange=${timerange}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((result:any) => {
        setSasTokenUrl(result?.data?.url);
        setStatus(`Sas url received ${result?.data?.url}`);
      })
      .catch((error) => {
        setStatus(`Error getting sas token: ${error.message}`);
      });
  };

  const handleFileUpload = () => {
    const blockBlobClient = new BlockBlobClient(sasTokenUrl);
    blockBlobClient
      .uploadData(selectedFileArrayBuffer)
      .then(() => {
        setStatus('File finished uploading');
      })
      .catch((error) => {
        setStatus(`File finished uploading with error : ${error.message}`);
      });
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <ErrorBoundary>
          <CssBaseline />

          <Box
            sx={{
              fontSize: 30,
              alignItems: 'center',
              margin: ' 5em 5em 3em 10em',
              border: '1px solid #ccc',
              height: '400px'
            }}
          >
            <TextField
              name="upload-photo"
              type="file"
              onChange={handleFileSelection}
            />
            <hr></hr>
            {selectedFile.name && (
              <Button
                variant="contained"
                component="label"
                onClick={handleFileRead}
              >
                Read {selectedFile.name}
              </Button>
            )}
            {selectedFileArrayBuffer && (
              <Button
                variant="contained"
                component="label"
                onClick={handleFileSasToken}
              >
                Get sas token for {selectedFile.name}
              </Button>
            )}
            {sasTokenUrl && (
              <Button
                variant="contained"
                component="label"
                onClick={handleFileUpload}
              >
                Upload {selectedFile.name}
              </Button>
            )}
            {status}
            <br></br>
            Text: {text}
          </Box>
        </ErrorBoundary>
      </ThemeProvider>
    </>
  );
}

export default App;

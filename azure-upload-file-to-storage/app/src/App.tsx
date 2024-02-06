import { BlockBlobClient } from '@azure/storage-blob';
import { Box, Card, Button, CardMedia, Grid, Typography } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ChangeEvent, useState } from 'react';
import ErrorBoundary from './components/error-boundary';
import NavBar from './components/navbar';
import { convertFileToArrayBuffer } from './lib/convert-file-to-arraybuffer';
import DragDropFile from './components/dragAndDrop';
import axios, { AxiosResponse } from 'axios';
import './App.css';

// Used only htmlFor local development
const API_SERVER = import.meta.env.VITE_API_SERVER as string;

const request = axios.create({
  baseURL: API_SERVER,
  headers: {
    'Content-type': 'application/json'
  }
});

type SasResponse = {
  url: string;
};
type ListResponse = {
  list: string[];
};

function App() {
  const containerName = `upload`;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sasTokenUrl, setSasTokenUrl] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [list, setList] = useState<string[]>([]);

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
  
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.files || target.files.length === 0) return;
  
    // Convert FileList to array and update state
    const filesArray = Array.from(target.files);
    setSelectedFiles(filesArray);
  
    // Reset other states
    setSasTokenUrl('');
    setUploadStatus('');
  };

  const handleFileSasToken = () => {
    const permission = 'w'; //write
    const timerange = 5; //minutes

    if (!selectedFiles[0]) return;

    request
      .post(
        `/api/sas?file=${encodeURIComponent(
          selectedFiles[0].name
        )}&permission=${permission}&container=${containerName}&timerange=${timerange}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then((result: AxiosResponse<SasResponse>) => {
        const { data } = result;
        const { url } = data;
        setSasTokenUrl(url);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          const { message, stack } = error;
          setSasTokenUrl(`Error getting sas token: ${message} ${stack || ''}`);
        } else {
          setUploadStatus(error as string);
        }
      });
  };

  const handleFileUpload = () => {
    if (selectedFiles.length === 0) return;
  
    Promise.all(
      selectedFiles.map((file) => {
        // Fetch SAS token htmlFor the current file
        return request
          .post(
            `/api/sas?file=${encodeURIComponent(
              file.name
            )}&permission=w&container=${containerName}&timerange=5`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          .then((result: AxiosResponse<SasResponse>) => {
            const { data } = result;
            const { url } = data;
            console.log(`SAS Token URL htmlFor ${file.name}: ${url}`);
            // Upload the file using the obtained SAS token
            return convertFileToArrayBuffer(file).then((fileArrayBuffer) => {
              if (
                fileArrayBuffer === null ||
                fileArrayBuffer.byteLength < 1 ||
                fileArrayBuffer.byteLength > 256000
              )
                return;
  
              const blockBlobClient = new BlockBlobClient(url);
              return blockBlobClient.uploadData(fileArrayBuffer);
            });
          });
      })
    )
      .then(() => {
        // All files uploaded successfully
        setUploadStatus('Successfully finished upload');
        // Fetch the updated file list
        return request.get(`/api/list?container=${containerName}`);
      })
      .then((result: AxiosResponse<ListResponse>) => {
        // Update the file list
        const { data } = result;
        const { list } = data;
        setList(list);
      })
      .catch((error: unknown) => {
        // Handle errors
        if (error instanceof Error) {
          const { message, stack } = error;
          setUploadStatus(
            `Failed to finish upload with error: ${message} ${stack || ''}`
          );
        } else {
          setUploadStatus(error as string);
        }
      });
  };
  
  return (
    <>
    <body className= 'body'>
      <NavBar></NavBar>
    <div className='app-container'>
      <ErrorBoundary>
        <Box>
          <div className='backgroundDragDrop'>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto&display=swap"/>
            <h1 className='h1'>Upload files</h1>
            <DragDropFile></DragDropFile>
            <h2>Export options</h2>
              <div className='filler'></div>
              <div className='checkboxes-left'>
                <div className='box-label'>
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Default checkbox
                </label>
                </div>
                <div className='box-label'>
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Yearly
                </label>
                </div>
                <div className='box-label'>
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Default checkbox
                </label>
                </div>
              </div>
              <div className='checkboxes-right'>
                <div className='box-label'>
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Default checkbox
                </label>
                </div>
                <div className='box-label'>
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  Default radio
                </label>
                </div>  
                <div className='box-label'> 
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"/>
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  Default radio
                </label>
                </div>  
              </div>
              <div className='filler'></div>
              <div className='upload-button-div'>
                <Button component="label" color='secondary' variant="contained"  onClick={handleFileUpload}>
                  Upload
                </Button>
                <a type="button" className="btn btn-purple"><i className="fas fa-heart pr-2" aria-hidden="false"></i>Heart</a>
              </div>
          </div>
          {/* App Title */}
          <Typography variant="h4" gutterBottom>
            Upload file to Azure Storage
          </Typography>
          <Typography variant="h5" gutterBottom>
            with SAS token
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Container: {containerName}</b>
          </Typography>

          {/* File Selection Section */}
          <Box
            display="block"
            justifyContent="left"
            alignItems="left"
            flexDirection="column"
            my={4}
          >
            <Button variant="contained" component="label">
             Select Files
            <input type="file" hidden multiple onChange={handleFileSelection} />
            </Button>
            {selectedFiles.length > 0 && (
              <Box my={2}>
                <Typography variant="body2">Selected Files:</Typography>
                <ul>
                  {selectedFiles.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
 
          SAS Token Section
          {selectedFiles && (
            <Box
              display="block"
              justifyContent="left"
              alignItems="left"
              flexDirection="column"
              my={4}
            >
              <Button variant="contained" onClick={handleFileSasToken}>
                Get SAS Token
              </Button>
              {sasTokenUrl && (
                <Box my={2}>
                  <Typography variant="body2">{sasTokenUrl}</Typography>
                </Box>
              )}
            </Box>
          )} 

          {/* File Upload Section */}
          {selectedFiles && (
            <Box
              display="block"
              justifyContent="left"
              alignItems="left"
              flexDirection="column"
              my={4}
            >
              <Button variant="contained" onClick={handleFileUpload}>
                Upload
              </Button>
              {uploadStatus && (
                <Box my={2}>
                  <Typography variant="body2" gutterBottom>
                    {uploadStatus}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Uploaded Files Display */}
          <Grid container spacing={2}>
            {list.map((item) => (
              <Grid item xs={6} sm={4} md={3} key={item}>
                <Card>
                  {item.endsWith('.jpg') ||
                  item.endsWith('.png') ||
                  item.endsWith('.jpeg') ||
                  item.endsWith('.gif') ? (
                    <CardMedia component="img" image={item} alt={item} />
                  ) : (
                    <Typography variant="body1" gutterBottom>
                      {item}
                    </Typography>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </ErrorBoundary>
    </div>
    </body>
   </> 
  );
}

export default App;

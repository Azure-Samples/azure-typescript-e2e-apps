import { useState, ChangeEvent } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import ErrorBoundary from './components/error-boundary';

import sasTokenService, {sasTokenObjectResponse} from './services/sas-token';
import uploadService, { uploadObjectResponse } from './services/file-upload';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
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
}

function App() {

  const [selectedFiles, setSelectedFiles] = useState<SelectedFilesType>({});
  const [errors, setErrors] = useState<any[]|unknown>([])

  function getFileNames(): string[] {
    const fileNames: string[] = Object.keys(selectedFiles);
    console.log(fileNames)
    return (fileNames && fileNames.length > 0) ? fileNames : [];
  }


  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    const fileObject: SelectedFilesType = {};

    // store files in object by name
    if (files && files.length) {

      Array.from(files).map((file: File) => {
        const key = file.name;

        fileObject[key] = file;
      });
      setSelectedFiles(fileObject);
    }
  }

  function handleUploadFiles() {

    // clear previous errors
    setErrors([]);

    // 1. Get SAS token for each file from API
    const fileNames: string[] = getFileNames();
    console.log(`fileNames: ${JSON.stringify(fileNames)}`)

    if (!fileNames || fileNames.length === 0) return;

    sasTokenService.getSasTokens(fileNames).then((sasObjects: sasTokenObjectResponse) => {

      if(sasObjects.error){
        setErrors(sasObjects.error);
        return;
      }
      
      if(!sasObjects.sasUrls || sasObjects.sasUrls.length===0) return;
      console.log(`sasObjects: ${JSON.stringify(sasObjects)}`)

      const sasUrls = sasObjects?.sasUrls;

      for (const sasUrl of sasUrls) {

        // 2. Upload each file using the SAS token URL 
        uploadService.upload(sasUrl, selectedFiles[sasUrl]).then((response: uploadObjectResponse) => {
          if(response.error){

            // @ts-ignore
            setErrors([...errors, response.error])
          }
        }).catch((error: unknown) => {
          // @ts-ignore
          setErrors([...errors, error])
        });
      }
    }).catch((error: unknown) => {
      // @ts-ignore
      setErrors([...errors, error])
    });
  }

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <ErrorBoundary>
          <CssBaseline />
          <Box sx={{
            fontSize: 30,
            alignItems: 'center',
            margin: ' 5em 5em 3em 10em',
            border: '1px solid #ccc',
            height: '400px',
          }}>
            <Box>
              <TextField
                name="upload-photo"
                type="file"
                inputProps={{
                  multiple: true
                }}
                onChange={handleFileInputChange}
              />
              {selectedFiles && Object.keys(selectedFiles).length > 0 &&
                <>
                  <Box sx={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    margin: '10px 0'
                  }}>
                    {selectedFiles && getFileNames().map((name, index: number) => (
                      <Typography key={index}>{name}</Typography>
                    ))}
                  </Box>
                  <Button variant="contained" type="button" onClick={handleUploadFiles}>
                    Upload files to Azure
                  </Button>
                </>
              }
            </Box>
          </Box>
          {JSON.stringify(errors)}
          {JSON.stringify(selectedFiles)}
        </ErrorBoundary>
      </ThemeProvider>
    </>
  );
}


export default App;

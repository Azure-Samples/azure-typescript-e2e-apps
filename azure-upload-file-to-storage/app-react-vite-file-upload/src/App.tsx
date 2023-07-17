// @ts-nocheck

import { useState, ChangeEvent } from 'react';
import { BlockBlobClient } from '@azure/storage-blob';
import ErrorBoundary from './components/error-boundary';

import axios from 'axios';
import './App.css';

const request = axios.create({
  baseURL: '',
  headers: {
    'Content-type': 'application/json'
  }
});

type SelectedFilesType = {
  [key: string]: File;
};

function App() {
  const [text, setText] = useState<string>('');
  const [readFileStatus, setReadFileStatus] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<SelectedFilesType>({});
  const [selectedFileArrayBuffer, setSelectedFileArrayBuffer] = useState<
    ArrayBuffer | undefined
  >(undefined);
  const [sasTokenUrl, setSasTokenUrl] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileSelection = (event) => {
    setSelectedFile(event?.target?.files[0]);

    // reset
    setText('');
    setSelectedFileArrayBuffer(undefined);
    setSasTokenUrl('');
    setUploadStatus('');
    setReadFileStatus('');
  };

  const handleFileRead = () => {
    if (selectedFile && selectedFile.name) {
      const reader = new FileReader();

      reader.onload = () => {
        const arrayBuffer = reader.result;
        setReadFileStatus('Successfully read file into ArrayBuffer');
        setSelectedFileArrayBuffer(arrayBuffer as ArrayBuffer);

        if (selectedFile?.name?.endsWith('.text')) {
          // convert to text to see what was there
          const text = new TextDecoder('utf-8').decode(
            arrayBuffer as ArrayBuffer
          );
          setText(text);
        }
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

    request
      .post(
        `/api/sas?file=${encodeURIComponent(
          selectedFile.name
        )}&permission=${permission}&container=${containerName}&timerange=${timerange}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then((result: any) => {
        setSasTokenUrl(result?.data?.url);
      })
      .catch((error) => {
        setSasTokenUrl(`Error getting sas token: ${error.message}`);
      });
  };

  const handleFileUpload = () => {
    const blockBlobClient = new BlockBlobClient(sasTokenUrl);
    blockBlobClient
      .uploadData(selectedFileArrayBuffer)
      .then(() => {
        setUploadStatus('Successfully finished upload');
      })
      .catch((error) => {
        setUploadStatus(`Failed to finish upload with error : ${error.message}`);
      });
  };

  return (
    <>
      <ErrorBoundary>

        <div className="container select-file">
        <input className="select-file" type="file" onChange={handleFileSelection} />
        </div>
        
        {selectedFile.name && (
          <div className="container get-file-buffer">
            <button className="get-file-buffer " onClick={handleFileRead}>
              Read file into Buffer
            </button>
            <div className="get-file-buffer status">{readFileStatus}<br></br>{text}</div>
          </div>
        )}

        {selectedFileArrayBuffer && (
          <div className="container get-sas-token">
            <button className="get-sas-token" onClick={handleFileSasToken}>
              Get sas token for {selectedFile.name}
            </button>
            <div className="get-sas-token status">
              <div className="get-sas-token status text">{sasTokenUrl}</div>
              </div>
          </div>
        )}
        {sasTokenUrl && (
          <div className="container upload">
            <button className="upload" onClick={handleFileUpload}>
              Upload {selectedFile.name}
            </button>
            <div className="upload status">{uploadStatus}</div>
          </div>
        )}
      </ErrorBoundary>
    </>
  );
}

export default App;

import { useState, ChangeEvent } from 'react';
import { BlockBlobClient } from '@azure/storage-blob';
import ErrorBoundary from './components/error-boundary';

import axios, { AxiosResponse } from 'axios';
import './App.css';

const request = axios.create({
  baseURL: '',
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
  const [text, setText] = useState<string>('');
  const [readFileStatus, setReadFileStatus] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileArrayBuffer, setSelectedFileArrayBuffer] = useState<
    ArrayBuffer | undefined
  >(undefined);
  const [sasTokenUrl, setSasTokenUrl] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [list, setList] = useState<string[]>([]);

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;

    if (!(target instanceof HTMLInputElement)) return;
    if (
      target?.files === null ||
      target?.files?.length === 0 ||
      target?.files[0] === null
    )
      return;
    setSelectedFile(target?.files[0]);

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
    const permission = 'w'; //write
    const timerange = 5; //minutes

    if (!selectedFile) return;

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
    const blockBlobClient = new BlockBlobClient(sasTokenUrl);
    if (
      !selectedFileArrayBuffer ||
      !(selectedFileArrayBuffer instanceof ArrayBuffer)
    )
      return;
    blockBlobClient
      .uploadData(selectedFileArrayBuffer)
      .then(() => {
        setUploadStatus('Successfully finished upload');
        return request.get(`/api/list?container=${containerName}`);
      })
      .then((result: AxiosResponse<ListResponse>) => {
        // Axios response
        const { data } = result;
        const { list } = data;
        setList(list);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          const { message, stack } = error;
          setUploadStatus(
            `Failed to finish upload with error : ${message} ${stack || ''}`
          );
        } else {
          setUploadStatus(error as string);
        }
      });
  };

  return (
    <>
      <ErrorBoundary>
        <h1>
          Upload file to Azure Storage directly using SAS token authentication
        </h1>
        <p>
          <b>Container: {containerName}</b>
        </p>
        <div className="container select-file">
          <input
            className="select-file"
            type="file"
            onChange={handleFileSelection}
          />
        </div>

        {selectedFile && selectedFile.name && (
          <div className="container get-file-buffer">
            <button className="get-file-buffer " onClick={handleFileRead}>
              Read file into Buffer
            </button>
            <div className="get-file-buffer status">
              {readFileStatus}
              <br></br>
              {text}
            </div>
          </div>
        )}

        {selectedFileArrayBuffer && (
          <div className="container get-sas-token">
            <button className="get-sas-token" onClick={handleFileSasToken}>
              Get sas token for {selectedFile?.name}
            </button>
            <div className="get-sas-token status">
              <div className="get-sas-token status text">{sasTokenUrl}</div>
            </div>
          </div>
        )}
        {sasTokenUrl && (
          <div className="container upload">
            <button className="upload" onClick={handleFileUpload}>
              Upload {selectedFile?.name}
            </button>
            <div className="upload status">{uploadStatus}</div>
          </div>
        )}
        <div className="list container">
          {list &&
            list.length > 0 &&
            list.map((item) => {
              if (
                item.endsWith('.jpg') ||
                item.endsWith('.png') ||
                item.endsWith('.jpeg') ||
                item.endsWith('.gif')
              )
                return (
                  <div className="list item">
                    <p>{item}</p>
                    <img height="100" src={item} alt={item} />
                  </div>
                );
              else return <p>{item}</p>;
            })}
        </div>
      </ErrorBoundary>
    </>
  );
}

export default App;

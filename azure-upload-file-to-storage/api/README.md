# Azure Functions V4 app to upload file to Azure Storage

Upload a file to Azure Storage using Azure Functions V4 and the Azure SDK package for Azure Storage.

1. Upload file to HTTP endpoint.
1. File is saved to Azure Storage. 
1. Read-only SAS token is generated for the file. 
1. Read-only URL including SAS token is returned to the client.

## Prerequisite

You need an Azure Storage account created and ready for Azure Functions.

## Environment variables

The app needs the following environment variables. These should be available in the `local.settings.json` while developing locally. 

```
"AzureWebJobsStorage": "<STORAGE-CONNECTION-STRING>",
"FUNCTIONS_WORKER_RUNTIME": "node",
"AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
"Azure_Storage_AccountName": "<STORAGE-ACCOUNT-NAME>",
"Azure_Storage_AccountKey":"<STORAGE-ACCOUNT-KEY>"
```

## Clone, install and run locally

1. In a new folder, use the following commands to get source code for this project. 

    ```bash
    git init
    git remote add origin https://github.com/azure-samples/azure-typescript-e2e-apps
    git config core.sparseCheckout true
    git sparse-checkout set api-functions-v4-upload-file
    git pull origin main
    git sparse-checkout disable
    ```

2. Install the dependencies.

    ```bash
    npm install
    ```

## Call function

Use the following cURL command, provided in [`upload-text-file.sh`](upload-text-file.sh) to automate your file uploads during development.

```bash
curl --location 'http://localhost:7071/api/upload' -F "file=@test-file.txt" --form 'name="tom"' --verbose
```

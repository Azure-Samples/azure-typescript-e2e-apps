# Upload file to Azure Storage with Azure Functions binding and triggers

This sample uses an HTTP trigger to receive a file via POST, then send the file on to Azure Storage via a Storage input binding. 

## Configure sample

Change the [local.settings.json](./local.settings.json) to use your own cloud Azure Storage resource. If you want Azure Functions to store its own runtime data in the same Storage account as the files then you only need one connection string, `AzureWebJobsStorage`.

```json
{
  "IsEncrypted": false,
  "Values": {
    "NODE_TLS_REJECT_UNAUTHORIZED": false,
    "AzureWebJobsStorage": "<STORAGE-CONNECTION-STRING>",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "AzureStorage_Uploads": "<STORAGE-CONNECTION-STRING-2>"
  }
}
```

## Azure Functions v4 programming model (PM)

While in preview, you need the `AzureWebJobsFeatureFlags` setting (both locally and in the cloud runtime for the Function app). 

## Example upload cURL commands

Use the [upload-file.sh](./upload-file.sh) bash script to upload a file into storage.
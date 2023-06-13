# js-e2e-azure-function-upload-file

Learn how to use this sample in the [documentation](https://docs.microsoft.com/azure/developer/javascript/how-to/with-web-app/azure-function-file-upload).

1. Upload file to HTTP endpoint.
1. Based on file name and user name, programmatically determine file location and generate SAS token based on that location. 
1. Return read-only URL including SAS token to the client. 
1. Pass on uploaded file to Azure Storage via Blob trigger.

## Clone, install and run locally

1. In a new folder, use the following commands to get source code for this project. 

    ```bash
    git init
    git remote add origin https://github.com/azure-samples/azure-typescript-e2e-apps
    git config core.sparseCheckout true
    git sparse-checkout set api-functions-v3-upload-file
    git pull origin main
    git sparse-checkout disable
    ```

2. Install the dependencies.

    ```bash
    npm install
    ``

## Deploy to Azure

* Add the Storage connection string as **AzureWebJobsStorage** app setting

## Call function

The following files have been provided to upload a document:

* upload.sh: `bash upload.sh`

    ```bash
    curl -X POST \
    -F 'filename=@test-file.txt' \
    -H 'Content-Type: text/plain' \
    'http://localhost:7071/api/upload?filename=test-file.txt&username=jsmith' --verbose
    ```

* upload-azure.sh: `bash upload-azure.sh` - you need to edit this file before calling it to add your resource name and function key (as the code).

    ```bash
    curl -X POST \
    -F 'filename=@test-file.txt' \
    -H 'Content-Type: text/plain' \
    'https://YOUR-RESOURCE-NAME.azurewebsites.net/api/upload?code=YOUR-FUNCTION-KEY&filename=test-file.txt&username=jsmith&code=abc' --verbose
    ```

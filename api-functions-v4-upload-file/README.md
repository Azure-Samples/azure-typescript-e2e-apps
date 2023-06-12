# js-e2e-azure-function-upload-file

Learn how to use this sample in the [documentation](https://docs.microsoft.com/azure/developer/javascript/how-to/with-web-app/azure-function-file-upload).

## Clone, install and run locally

```bash
git clone https://github.com/azure-Samples/js-e2e-azure-function-upload-file && \
cd js-e2e-azure-function-upload-file && npm install \
npm start
```

## Clone, install and run in dev container

```bash
git clone https://github.com/azure-Samples/js-e2e-azure-function-upload-file && \
cd js-e2e-azure-function-upload-file && npm install \
code . \
```

Once Visual Studio Code, use **Remote - Containers** extension to open the project in a dev container. 

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

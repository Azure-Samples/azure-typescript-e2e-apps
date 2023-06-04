# Azure Functions

## Create a new function with V4 model

1. Create a new folder and change into that folder:

    ```bash 
    mkdir api-v4
    cd api-v4
    ```

1. Install the latest version of [Azure Functions core tools](https://www.npmjs.com/package/azure-functions-core-tools).

    ```bash
    npm install -g https://www.npmjs.com/package/azure-functions-core-tools
    ```

1. Run following commands to create new TypeScript Functions app. 

    ```bash
    func init --worker-runtime node --model V4 --language typescript
    func new  
    npm run build
    nom run start
    ```
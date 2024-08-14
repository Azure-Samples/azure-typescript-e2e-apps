---
name: "Tutorial: Manage Azure resource groups with TypeScript Function API"
description: In this tutorial, you'll create a local TypeScript Azure Function app with APIs to manage Azure resource groups and deploy the app to Azure.
page_type: sample
languages:
- javascript
- typescript
products:
- azure-functions
---
# JavaScript end-to-end Azure Function to manage Azure

This sample is used as part of a [Tutorial: Manage Azure resource groups with TypeScript Function API](https://learn.microsoft.com/azure/developer/javascript/how-to/with-web-app/azure-function-resource-group-management).

A simple Azure Function app with three API endpoints:

* [POST,DELETE] http://localhost:7071/api/resourcegroup
* [GET] http://localhost:7071/api/resourcegroups
* [GET] http://localhost:7071/api/resources

## Security

This sample uses the default Azure Functions experience which includes a connection string to Azure Storage. To learn about production security practices:

* [Securing Azure Functions](https://learn.microsoft.com/azure/azure-functions/security-concepts)
* [Security recommendations for Blob storage](https://learn.microsoft.com/azure/storage/blobs/security-recommendations)

## Features

* List all resource groups in a subscription
* List all resources in a subscription
* List all resources in a resource group
* Create a resource group
* Delete a resource group

## Getting Started

### Installation Prerequisites

* Node.js LTS (18 or above) - using the v2 programming model of Azure Functions
* Azure Functions Core tools v4.0.5095 or above - `npm install -g azure-functions-core-tools@4 --unsafe-perm true`
* Azure Functions VSCode extension v1.10.4 or above

### Environment Variables

Environments:
* Local development uses [./local.settings.json](./local.settings.json)
* Remote development uses Azure Function Configuration settings

The following environment variables must be set:
* "AZURE_CLIENT_ID": "",
* "AZURE_CLIENT_SECRET": "",
* "AZURE_SUBSCRIPTION_ID":"",
* "AZURE_TENANT_ID":""

Do not change the names of the variables.

### Installation

- npm install 

### Quickstart with local development 

1. Run the following bash command:

    ```bash
    npm start
    ```

1. Wait until the local runtime displays the routes with methods.
1. Query the APIs with HTTP.

## cURL commands

Once you deploy your Azure Function to Azure, use the following cURL commands to request the APIs. Replace `YOUR-RESOURCE_NAME` with your own resource name.

### Add a resource group to your subscription

```bash
curl -X POST https://YOUR-RESOURCE_NAME.azurewebsites.net/api/resourcegroup \
  -H 'Content-Type: application/json' \
  -d '{"name":"REPLACE-WITH-YOUR-RESOURCE-GROUP-NAME","location":"westus"}'
```
  
### Delete a resource group from your subscription  

```bash
curl -X DELETE https://YOUR-RESOURCE_NAME.azurewebsites.net/api/resourcegroup \
  -H 'Content-Type: application/json' \
  -d '{"name":"REPLACE-WITH-YOUR-RESOURCE-GROUP-NAME"}'
```

### Get all resource groups in your subscription

```bash
curl https://YOUR-RESOURCE_NAME.azurewebsites.net/api/resourcegroups
```

## Resources

- [Azure Functions](https://docs.microsoft.com/azure/azure-functions/)
- [Azure SDK for JavaScript](https://docs.microsoft.com/azure/developer/javascript/azure-sdk-library-package-index)
- [Azure SDK for Identity (DefaultAzureCredential)](https://docs.microsoft.com/javascript/api/overview/azure/identity-readme?view=azure-node-latest)
- [Azure SDK for Azure Resource Groups](https://docs.microsoft.com/javascript/api/overview/azure/arm-resources-readme)

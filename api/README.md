---
page_type: sample
languages:
- javascript
- typescript
- nodejs
products:
- azure-app-service
- azure-functions
---

# Azure Functions Node.js v4 PM - status API

A simple serverless API returning the requestor's HTTP headers and server environment variables.

## Prerequisites

Install the following: 

* [Azure Functions core tools](https://www.npmjs.com/package/azure-functions-core-tools)
* Optional, [azurite](https://www.npmjs.com/package/azurite)

```console
npm install -g azure-functions-core-tools@4
```

## Update local.settings.json

Azure Functions needs to use azurite npm package or use an Azure Storage account for the `local.settings.json` property of `AzureWebJobsStorage`. 

## Run the sample

```console
func start --verbose
```

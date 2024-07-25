---
name: Azure TypeScript apps
description: A variety of TypeScript apps to deploy on Azure or integrate with Azure services.
page_type: sample
languages:
- javascript
- typescript
products:
- azure-app-service
- azure-functions
---

# Azure TypeScript E2E apps

A monorepo of apps used with the Azure cloud as part of the [Azure Developer Center for JavaScript](https://learn.microsoft.com/azure/developer/javascript/). This repo provides sample code and project to deploy JavaScript and TypeScript to Azure. 

## Features

* `.devcontainer`: local proxied react + api using [SWA CLI](https://learn.microsoft.com/en-us/azure/static-web-apps/static-web-apps-cli-configuration)
* `app-react-vite`: very simple React 18 + Vite app with Azure _easy auth_
* `api`: very simple Node.js Azure Functions v4 (new programming model) with `/status` route
* `api-inmemory`: very simple Node.js Azure Functions v4 (new programming model) with `/status` and in-memory db for `/todo` route
* `docs`: helpful information about resources
* `example-workflows`: example GitHub workflow files you can use to build and deploy apps

## Documentation

* React 18 (Vite) + Azure Functions API v4

## Naming conventions

|Name|Description|
|--|--|
|`app-`|Client or full-stack web app.|
|`api=`|HTTP API.|
|`lib-`|Library. Included in other projects.|
|`cli-`|Command-line interface.|

---
page_type: sample
name: Create Express.js virtual machine using Azure CLI
description: This tutorial shows how to secure two App Services (frontend and backend), passing user auth from the frontend app to the backend. 
languages:
- javascript
- nodejs
products:
- azure-virtual-machines
---

# Create JavaScript Express.js virtual machine using Azure CLI


In this tutorial, create a Linux virtual machine (VM) for an Express.js app. The VM is configured with a cloud-init configuration file and includes NGINX and a GitHub repository for an Express.js app. Connect to the VM with SSH, change the web app to including trace logging, and view the public Express.js server app in a web browser.

This tutorial includes the following tasks:

* Sign in to Azure with Azure CLI
* Create Azure Linux VM resource with Azure CLI
    * Open public port 80
    * Install demo Express.js web app from a GitHub repository
    * Install web app dependencies
    * Start web app
* Create Azure Monitoring resource with Azure CLI
    * Connect to VM with SSH
    * Install Azure SDK client library with npm
    * Add Application Insights client library code to create custom tracing
* View web app from browser
    * Request `/trace` route to generate custom tracing in Application Insights log
    * View count of traces collected in log with Azure CLI
    * View list of traces with Azure portal
* Remove resources with Azure CLI

For a complete tutorial, please use the [Microsoft Documentation tutorial found here](https://learn.microsoft.com/azure/developer/javascript/tutorial/run-nodejs-virtual-machine). 

## Express.js

The Express.js app is a basic web page for the root route to return text. The local app uses port 3000. 

Because this app is used as a base for tutorials, the main branch is sparse on purpose. 

## VM configuration with cloud-init-github.txt

The VM [cloud-init file](./cloud-iit-github.txt) to pull this repo into an [Azure Linux VM](https://docs.microsoft.com/azure/virtual-machines/linux) is provided for you. 

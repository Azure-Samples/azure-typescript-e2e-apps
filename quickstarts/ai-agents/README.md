# Azure AI Agents quickstarts

Azure AI Agent Service allows you to create AI agents tailored to your needs through custom instructions and augmented by advanced tools like code interpreter, and custom functions.

* [Quickstart documentation](https://learn.microsoft.com/azure/ai-services/agents/quickstart?pivots=programming-language-typescript)
* [Reference documentation](https://learn.microsoft.com/en-us/javascript/api/@azure/ai-projects/?view=azure-node-preview)
* [@azure/ai-projects](https://www.npmjs.com/package/@azure/ai-projects)

## Use the quickstarts

1. Verify the [prerequisites](https://learn.microsoft.com/azure/ai-services/agents/quickstart?pivots=programming-language-typescript#prerequisites). 
1. Create resources, as documented in the quickstart. We recommend [Deploy to Azure](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazureai-samples%2Fmain%2Fscenarios%2FAgents%2Fsetup%2Fbasic-agent-identity%2Fazuredeploy.json) to create the resources. Be aware some fields are empty in the deployment template because they are optional.
1. Rename `sample.env` to `.env` and set your AI project connection string. 
1. In the terminal go to either the JS or TS subfolder. 

    ```bash
    npm install
    npm start




# Azure OpenAI Assistants Quickstart

Use the Azure OpenAI Assistants client library to show how the assistant can generate JavaScript code for you.

* [Client library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai-assistants)
* [npm package](https://www.npmjs.com/package/@azure/openai-assistants)

## Environment variables

Two sets of environment variables are offered in the [sample.env](sample.env) which you should rename to `.env` when you use it. 

The first set is the recommended variables due to their security: 

```
# Used to authenticate using Azure AD as a service principal for role-based
# authentication.
#
# See the documentation for `EnvironmentCredential` at the following link:
# https://docs.microsoft.com/javascript/api/@azure/identity/environmentcredential
AZURE_TENANT_ID=<AD tenant id or name>
AZURE_CLIENT_ID=<ID of the user/service principal to authenticate as>
AZURE_CLIENT_SECRET=<client secret used to authenticate to Azure AD>
```

The second set is only recommended for learning the SDK and isn't meant for development or production:

```
AZURE_OPENAI_KEY=<MY_RESOURCE_KEY>
AZURE_OPENAI_RESOURCE=<MY_RESOURCE_NAME>
AZURE_OPENAI_ENDPOINT=https://<MY_RESOURCE_NAME>.openai.azure.com/
```
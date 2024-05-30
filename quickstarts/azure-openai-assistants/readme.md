# Azure OpenAI Assistants Quickstart

Use the Azure OpenAI Assistants client library to show how the assistant can generate JavaScript code for you.

* [Client library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai-assistants)
* [npm package](https://www.npmjs.com/package/@azure/openai-assistants)

## Environment variables

Two sets of environment variables are offered in the [sample.env](sample.env) which you should rename to `.env` when you use it. 

### Recommended: Passwordless with `Cognitive Services User` role

The first set is the recommended variables due to their security: 

```
# Used to authenticate using Azure AD as a service principal for role-based
# authentication.
# See the documentation for `EnvironmentCredential` at the following link:
# https://docs.microsoft.com/javascript/api/@azure/identity/environmentcredential
AZURE_TENANT_ID=<AD tenant id or name>
AZURE_CLIENT_ID=<ID of the user/service principal to authenticate as>
AZURE_CLIENT_SECRET=<client secret used to authenticate to Azure AD>
AZURE_OPENAI_DEPLOYMENT_NAME=<REPLACE-WITH-DEPLOYMENT-NAME>
OPENAI_API_VERSION=<API_VERSION> 
```

Learn more about [API Versions](https://learn.microsoft.com/azure/ai-services/openai/api-version-deprecation)

### Passwords

The second set is only recommended for learning the SDK and isn't meant for development or production:

```
AZURE_OPENAI_KEY=<REPLACE-WITH-RESOURCE-KEY>
AZURE_OPENAI_RESOURCE=<REPLACE-WITH-RESOURCE_NAME>
AZURE_OPENAI_ENDPOINT=https://<REPLACE-WITH-RESOURCE_NAME>.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=<REPLACE-WITH-DEPLOYMENT-NAME>
OPENAI_API_VERSION=<API_VERSION> 
```

Learn more about [API Versions](https://learn.microsoft.com/azure/ai-services/openai/api-version-deprecation)


## Output

Sample output from this application is: 

```console
Assistant created: {"id":"asst_zXaZ5usTjdD0JGcNViJM2M6N","createdAt":"2024-04-08T19:26:38.000Z","name":"Math Tutor","description":null,"model":"daisy","instructions":"You are a personal math tutor. Write and run JavaScript code to answer math questions.","tools":[{"type":"code_interpreter"}],"fileIds":[],"metadata":{}}
Thread created: {"id":"thread_KJuyrB7hynun4rvxWdfKLIqy","createdAt":"2024-04-08T19:26:38.000Z","metadata":{}}
Message created:  {"id":"msg_o0VkXnQj3juOXXRCnlZ686ff","createdAt":"2024-04-08T19:26:38.000Z","threadId":"thread_KJuyrB7hynun4rvxWdfKLIqy","role":"user","content":[{"type":"text","text":{"value":"I need to solve the equation `3x + 11 = 14`. Can you help me?","annotations":[]},"imageFile":{}}],"assistantId":null,"runId":null,"fileIds":[],"metadata":{}}
Created run
Run created:  {"id":"run_P8CvlouB8V9ZWxYiiVdL0FND","object":"thread.run","status":"queued","model":"daisy","instructions":"You are a personal math tutor. Write and run JavaScript code to answer math questions.","tools":[{"type":"code_interpreter"}],"metadata":{},"usage":null,"assistantId":"asst_zXaZ5usTjdD0JGcNViJM2M6N","threadId":"thread_KJuyrB7hynun4rvxWdfKLIqy","fileIds":[],"createdAt":"2024-04-08T19:26:39.000Z","expiresAt":"2024-04-08T19:36:39.000Z","startedAt":null,"completedAt":null,"cancelledAt":null,"failedAt":null}
Message content: "The solution to the equation \\(3x + 11 = 14\\) is \\(x = 1\\)."
Message content: "Yes, of course! To solve the equation \\( 3x + 11 = 14 \\), we can follow these steps:\n\n1. Subtract 11 from both sides of the equation to isolate the term with x.\n2. Then, divide by 3 to find the value of x.\n\nLet me calculate that for you."
Message content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
```
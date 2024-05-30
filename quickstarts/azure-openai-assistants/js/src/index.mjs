import "dotenv/config";
import { AzureOpenAI } from "openai";

// Add `Cognitive Services User` to identity for Azure OpenAI resource
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";

// Get environment variables
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureOpenAIDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const azureOpenAIVersion = process.env.OPENAI_API_VERSION;

// Check env variables
if (!azureOpenAIEndpoint || !azureOpenAIDeployment || !azureOpenAIVersion) {
  throw new Error(
    "Please ensure to set AZURE_OPENAI_DEPLOYMENT_NAME and AZURE_OPENAI_ENDPOINT in your environment variables."
  );
}

// Get Azure SDK client
const getClient = () => {
  const credential = new DefaultAzureCredential();
  const scope = "https://cognitiveservices.azure.com/.default";
  const azureADTokenProvider = getBearerTokenProvider(credential, scope);
  const assistantsClient = new AzureOpenAI({
    endpoint: azureOpenAIEndpoint,
    apiVersion: azureOpenAIVersion,
    azureADTokenProvider,
  });
  return assistantsClient;
};

const assistantsClient = getClient();

const options = {
  model: azureOpenAIDeployment, // Deployment name seen in Azure AI Studio
  name: "Math Tutor",
  instructions:
    "You are a personal math tutor. Write and run JavaScript code to answer math questions.",
  tools: [{ type: "code_interpreter" }],
};
const role = "user";
const message = "I need to solve the equation `3x + 11 = 14`. Can you help me?";

// Create an assistant
const assistantResponse = await assistantsClient.beta.assistants.create(
  options
);
console.log(`Assistant created: ${JSON.stringify(assistantResponse)}`);

// Create a thread
const assistantThread = await assistantsClient.beta.threads.create({});
console.log(`Thread created: ${JSON.stringify(assistantThread)}`);

// Add a user question to the thread
const threadResponse = await assistantsClient.beta.threads.messages.create(
  assistantThread.id,
  {
    role,
    content: message,
  }
);
console.log(`Message created:  ${JSON.stringify(threadResponse)}`);

// Run the thread and poll it until it is in a terminal state
const runResponse = await assistantsClient.beta.threads.runs.createAndPoll(
  assistantThread.id,
  {
    assistant_id: assistantResponse.id,
  },
  { pollIntervalMs: 500 }
);
console.log(`Run created:  ${JSON.stringify(runResponse)}`);

// Get the messages
const runMessages = await assistantsClient.beta.threads.messages.list(
  assistantThread.id
);
for await (const runMessageDatum of runMessages) {
  for (const item of runMessageDatum.content) {
    // types are: "image_file" or "text"
    if (item.type === "text") {
      console.log(`Message content: ${JSON.stringify(item.text?.value)}`);
    }
  }
}

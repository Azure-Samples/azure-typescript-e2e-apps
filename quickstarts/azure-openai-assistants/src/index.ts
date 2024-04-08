import {
  AssistantsClient,
  AssistantCreationOptions,
  ToolDefinition,
} from "@azure/openai-assistants";

import { DefaultAzureCredential } from "@azure/identity";

import "dotenv/config";

const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT as string;
const azureOpenAIModelId = process.env.AZURE_OPENAI_MODEL_ID as string;

if (!azureOpenAIEndpoint || !azureOpenAIModelId) {
  throw new Error(
    "Please ensure to set AZURE_OPENAI_KEY and AZURE_OPENAI_ENDPOINT in your environment variables."
  );
}

const getClient = () => {
  const credential = new DefaultAzureCredential();
  const assistantsClient = new AssistantsClient(azureOpenAIEndpoint, credential);
  return assistantsClient;  
}

const assistantsClient = getClient();

const options: AssistantCreationOptions = {
  model: azureOpenAIModelId, // Deployment name seen in Azure AI Studio
  name: "Math Tutor",
  instructions:
    "You are a personal math tutor. Write and run JavaScript code to answer math questions.",
  tools: [{ type: "code_interpreter" } as ToolDefinition],
};
const role = "user";
const message = "I need to solve the equation `3x + 11 = 14`. Can you help me?";
const message2 = "What is 3x + 11 = 14?";

// Create an assistant
const assistantResponse = await assistantsClient.createAssistant(options);
console.log(`Assistant created: ${JSON.stringify(assistantResponse)}`);

// Create a thread
const assistantThread = await assistantsClient.createThread({});
console.log(`Thread created: ${JSON.stringify(assistantThread)}`);

// Add a user question to the thread
const threadResponse = await assistantsClient.createMessage(
  assistantThread.id,
  role,
  message
);
console.log(`Message created:  ${JSON.stringify(threadResponse)}`);

// Run the thread
let runResponse = await assistantsClient.createRun(assistantThread.id, {
  assistantId: assistantResponse.id,
});
console.log(`Run created:  ${JSON.stringify(runResponse)}`);

// Wait for the assistant to respond
do {
  await new Promise((r) => setTimeout(r, 500));
  runResponse = await assistantsClient.getRun(
    assistantThread.id,
    runResponse.id
  );
} while (
  runResponse.status === "queued" ||
  runResponse.status === "in_progress"
);

// Get the messages
const runMessages = await assistantsClient.listMessages(assistantThread.id);
for (const runMessageDatum of runMessages.data) {
  for (const item of runMessageDatum.content) {
    if (item.type === "text") {
      console.log(`Message content: ${JSON.stringify(item.text?.value)}`);
    }
  }
}

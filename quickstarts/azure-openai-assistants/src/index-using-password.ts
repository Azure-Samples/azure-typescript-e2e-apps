import {
  AssistantsClient,
  AssistantCreationOptions,
  ToolDefinition,
  Assistant,
  AssistantThread,
  ThreadMessage,
  ThreadRun,
  ListResponseOf,
  MessageContent
} from "@azure/openai-assistants";
import { AzureKeyCredential } from "@azure/core-auth";

import "dotenv/config";

const azureOpenAIKey = process.env.AZURE_OPENAI_KEY as string;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT as string;
const azureOpenAIModelId = process.env.AZURE_OPENAI_MODEL_ID as string;
const credential = new AzureKeyCredential(azureOpenAIKey);

if (!azureOpenAIKey || !azureOpenAIEndpoint || !azureOpenAIModelId) {
  throw new Error(
    "Please ensure to set AZURE_OPENAI_KEY and AZURE_OPENAI_ENDPOINT in your environment variables."
  );
}

const getClient = (): AssistantsClient => {
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

// Create an assistant
const assistantResponse: Assistant = await assistantsClient.createAssistant(options);
console.log(`Assistant created: ${JSON.stringify(assistantResponse)}`);

// Create a thread
const assistantThread: AssistantThread = await assistantsClient.createThread({});
console.log(`Thread created: ${JSON.stringify(assistantThread)}`);

// Add a user question to the thread
const threadResponse: ThreadMessage = await assistantsClient.createMessage(
  assistantThread.id,
  role,
  message
);
console.log(`Message created:  ${JSON.stringify(threadResponse)}`);

// Run the thread
let runResponse: ThreadRun = await assistantsClient.createRun(assistantThread.id, {
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
  // RunStatus is an enum with the following values: 
  // "queued", "in_progress", "requires_action", "cancelling", "cancelled", "failed", "completed", "expired"
  runResponse.status === "queued" ||
  runResponse.status === "in_progress"
);

// Get the messages
const runMessages: ListResponseOf<ThreadMessage> = await assistantsClient.listMessages(assistantThread.id);
for (const runMessageDatum of runMessages.data) {
  for (const item of runMessageDatum.content) {
    // types are: "image_file" or "text"
    if (item.type === "text") {
      console.log(`Message content: ${JSON.stringify(item.text?.value)}`);
    }
  }
}

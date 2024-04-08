
import { AssistantsClient, AssistantCreationOptions, MessageRole, CodeInterpreterToolDefinition, ToolDefinition } from "@azure/openai-assistants";
import { AzureKeyCredential } from "@azure/core-auth";

import 'dotenv/config'

const azureOpenAIKey = process.env.AZURE_OPENAI_KEY as string;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT as string;

if (!azureOpenAIKey || !azureOpenAIEndpoint) {
  throw new Error(
    "Please ensure to set AZURE_OPENAI_KEY and AZURE_OPENAI_ENDPOINT in your environment variables."
  );
}

const credential = new AzureKeyCredential(azureOpenAIKey);

const assistantsClient = new AssistantsClient(azureOpenAIEndpoint, credential);

const options: AssistantCreationOptions = {
  model: "gpt-4-1106-Preview",
  name: "Math Tutor",
  instructions: "You are a personal math tutor. Write and run code to answer math questions.",
  tools: [{ type: "code_interpreter" } as ToolDefinition],
};

// Create an assistant
const assistantResponse = await assistantsClient.createAssistant(options);
console.log(assistantResponse);

// Create a thread
const assistantThread = await assistantsClient.createThread({});
console.log(assistantThread);

// Add a user question to the thread
const threadResponse = await assistantsClient.createMessage(assistantThread.id, "user", "I need to solve the equation `3x + 11 = 14`. Can you help me?");
console.log(threadResponse);

// Run the thread
let runResponse = await assistantsClient.createRun(
  assistantThread.id,
  {
    assistantId: assistantResponse.id
  }
);
console.log(runResponse);

// Wait for the assistant to respond
do {
  await new Promise((r) => setTimeout(r, 500));
  runResponse = await assistantsClient.getRun(assistantThread.id, runResponse.id);
} while (runResponse.status === "queued" || runResponse.status === "in_progress");

// Get the messages
const runMessages = await assistantsClient.listMessages(assistantThread.id);
for (const runMessageDatum of runMessages.data) {
  for (const item of runMessageDatum.content) {
    if (item.type === "text") {
      console.log(item.text?.value);
    }
  }
}

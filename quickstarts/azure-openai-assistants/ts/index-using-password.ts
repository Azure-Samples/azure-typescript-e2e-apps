import "dotenv/config";
import { AzureOpenAI } from "openai";
import {
  Assistant,
  AssistantCreateParams,
  AssistantTool,
} from "openai/resources/beta/assistants";
import { Message, MessagesPage } from "openai/resources/beta/threads/messages";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";

// Get environment variables
const azureOpenAIKey = process.env.AZURE_OPENAI_KEY as string;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT as string;
const azureOpenAIDeployment = process.env
  .AZURE_OPENAI_DEPLOYMENT_NAME as string;
const openAIVersion = process.env.OPENAI_API_VERSION as string;

// Check env variables
if (!azureOpenAIKey || !azureOpenAIEndpoint || !azureOpenAIDeployment || !openAIVersion) {
  throw new Error(
    "Please set AZURE_OPENAI_KEY and AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_DEPLOYMENT_NAME in your environment variables."
  );
}

// Get Azure SDK client
const getClient = (): AzureOpenAI => {
  const assistantsClient = new AzureOpenAI({
    endpoint: azureOpenAIEndpoint,
    apiVersion: openAIVersion,
    apiKey: azureOpenAIKey,
  });
  return assistantsClient;
};

const assistantsClient = getClient();

const options: AssistantCreateParams = {
  model: azureOpenAIDeployment, // Deployment name seen in Azure AI Studio
  name: "Math Tutor",
  instructions:
    "You are a personal math tutor. Write and run JavaScript code to answer math questions.",
  tools: [{ type: "code_interpreter" } as AssistantTool],
};
const role = "user";
const message = "I need to solve the equation `3x + 11 = 14`. Can you help me?";

// Create an assistant
const assistantResponse: Assistant =
  await assistantsClient.beta.assistants.create(options);
console.log(`Assistant created: ${JSON.stringify(assistantResponse)}`);

// Create a thread
const assistantThread: Thread = await assistantsClient.beta.threads.create({});
console.log(`Thread created: ${JSON.stringify(assistantThread)}`);

// Add a user question to the thread
const threadResponse: Message =
  await assistantsClient.beta.threads.messages.create(assistantThread.id, {
    role,
    content: message,
  });
console.log(`Message created:  ${JSON.stringify(threadResponse)}`);

// Run the thread and poll it until it is in a terminal state
const runResponse: Run = await assistantsClient.beta.threads.runs.createAndPoll(
  assistantThread.id,
  {
    assistant_id: assistantResponse.id,
  },
  { pollIntervalMs: 500 }
);
console.log(`Run created:  ${JSON.stringify(runResponse)}`);

// Get the messages
const runMessages: MessagesPage =
  await assistantsClient.beta.threads.messages.list(assistantThread.id);
for await (const runMessageDatum of runMessages) {
  for (const item of runMessageDatum.content) {
    // types are: "image_file" or "text"
    if (item.type === "text") {
      console.log(`Message content: ${JSON.stringify(item.text?.value)}`);
    }
  }
}

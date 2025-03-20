// index.js

import {
  AIProjectsClient,
  DoneEvent,
  ErrorEvent,
  isOutputOfType,
  MessageStreamEvent,
  RunStreamEvent,
  ToolUtility,
} from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import dotenv from 'dotenv';

dotenv.config();

// Set the connection string from the environment variable
const connectionString = process.env.PROJECT_CONNECTION_STRING;

// Throw an error if the connection string is not set
if (!connectionString) {
  throw new Error("Please set the PROJECT_CONNECTION_STRING environment variable.");
}

export async function main() {
  const client = AIProjectsClient.fromConnectionString(
    connectionString || "",
    new DefaultAzureCredential(),
  );

  // Step 1 code interpreter tool
  const codeInterpreterTool = ToolUtility.createCodeInterpreterTool();

  // Step 2 an agent
  const agent = await client.agents.createAgent("gpt-4o-mini", {
    name: "my-agent",
    instructions: "You are a helpful agent",
    tools: [codeInterpreterTool.definition],
    toolResources: codeInterpreterTool.file_ids,
  });

  // Step 3 a thread
  const thread = await client.agents.createThread();

  // Step 4 a message to thread
  await client.agents.createMessage(
    thread.id, {
    role: "user",
    content: "I need to solve the equation `3x + 11 = 14`. Can you help me?",
  });

  // Intermission is now correlated with thread
  // Intermission messages will retrieve the message just added

  // Step 5 the agent
  const streamEventMessages = await client.agents.createRun(thread.id, agent.id).stream();

  for await (const eventMessage of streamEventMessages) {
    switch (eventMessage.event) {
      case RunStreamEvent.ThreadRunCreated:
        break;
      case MessageStreamEvent.ThreadMessageDelta:
        {
          const messageDelta = eventMessage.data;
          messageDelta.delta.content.forEach((contentPart) => {
            if (contentPart.type === "text") {
              const textContent = contentPart;
              const textValue = textContent.text?.value || "No text";
            }
          });
        }
        break;

      case RunStreamEvent.ThreadRunCompleted:
        break;
      case ErrorEvent.Error:
        console.log(`An error occurred. Data ${eventMessage.data}`);
        break;
      case DoneEvent.Done:
        break;
    }
  }

  // 6. Print the messages from the agent
  const messages = await client.agents.listMessages(thread.id);

  // Messages iterate from oldest to newest
  // messages[0] is the most recent
  for (let i = messages.data.length - 1; i >= 0; i--) {
    const m = messages.data[i];
    if (m.content && m.content.length > 0 && isOutputOfType(m.content[0], "text")) {
      const textContent = m.content[0];
      console.log(`${textContent.text.value}`);
      console.log(`---------------------------------`);
    }
  }

  // 7. Delete the agent once done
  await client.agents.deleteAgent(agent.id);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
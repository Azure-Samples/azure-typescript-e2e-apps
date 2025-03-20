// index.ts

import type {
  MessageDeltaChunk,
  MessageDeltaTextContent,
  MessageTextContentOutput,
} from "@azure/ai-projects";
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

const connectionString =
  process.env["AZURE_AI_PROJECTS_CONNECTION_STRING"] || "<project connection string>";

if (!connectionString) {
  throw new Error("AZURE_AI_PROJECTS_CONNECTION_STRING must be set in the environment variables");
}

export async function main(): Promise<void> {
  const client = AIProjectsClient.fromConnectionString(
    connectionString || "",
    new DefaultAzureCredential(),
  );

  // Step 1: Create code interpreter tool
  const codeInterpreterTool = ToolUtility.createCodeInterpreterTool();

  // Step 2: Create an agent
  const agent = await client.agents.createAgent("gpt-4o-mini", {
    name: "my-agent",
    instructions: "You are a helpful agent",
    tools: [codeInterpreterTool.definition],
    toolResources: {
      codeInterpreter: {
        fileIds: []
      }
    }
  });

  // Step 3: Create a thread
  const thread = await client.agents.createThread();

  // Step 4: Add a message to thread
  await client.agents.createMessage(
    thread.id, {
    role: "user",
    content: "I need to solve the equation `3x + 11 = 14`. Can you help me?",
  });

  // Intermission: message is now correlated with thread
  // Intermission: listing messages will retrieve the message just added

  // Step 5: Run the agent
  const streamEventMessages = await client.agents.createRun(thread.id, agent.id).stream();

  for await (const eventMessage of streamEventMessages) {
    switch (eventMessage.event) {
      case RunStreamEvent.ThreadRunCreated:
        break;
      case MessageStreamEvent.ThreadMessageDelta:
        {
          const messageDelta = eventMessage.data as MessageDeltaChunk;
          messageDelta.delta.content.forEach((contentPart) => {
            if (contentPart.type === "text") {
              const textContent = contentPart as MessageDeltaTextContent;
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
    if (isOutputOfType<MessageTextContentOutput>(m.content[0], "text")) {
      const textContent = m.content[0] as MessageTextContentOutput;
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
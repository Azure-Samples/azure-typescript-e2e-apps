import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";
import "@azure/openai/types";
import "dotenv/config";
import { AzureOpenAI } from "openai";

// You will need to set these environment variables or edit the following values
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "<endpoint>";
const searchEndpoint = process.env["AZURE_AI_SEARCH_ENDPOINT"];
const searchIndex = process.env["AZURE_AI_SEARCH_INDEX"];

// Required Azure OpenAI deployment name and API version
const deploymentName = "gpt-4";
const apiVersion = "2024-07-01-preview";

function getClient(): AzureOpenAI {
  const scope = "https://cognitiveservices.azure.com/.default";
  const azureADTokenProvider = getBearerTokenProvider(
    new DefaultAzureCredential(),
    scope
  );
  return new AzureOpenAI({
    endpoint,
    azureADTokenProvider,
    deployment: deploymentName,
    apiVersion,
  });
}

async function main() {
  const client = getClient();

  const messages = [
    { role: "user", content: "What are my available health plans?" },
  ];

  console.log(`Message: ${messages.map((m) => m.content).join("\n")}`);

  const events = await client.chat.completions.create({
    stream: true,
    messages: [
      {
        role: "user",
        content:
          "What's the most common feedback we received from our customers about the product?",
      },
    ],
    max_tokens: 128,
    model: "",
    data_sources: [
      {
        type: "azure_search",
        parameters: {
          endpoint: searchEndpoint,
          index_name: searchIndex,
          authentication: {
            type: "system_assigned_managed_identity",
          },
        },
      },
    ],
  });

  let response = "";
  for await (const event of events) {
    for (const choice of event.choices) {
      const newText = choice.delta?.content;
      if (newText) {
        response += newText;
        // To see streaming results as they arrive, uncomment line below
        // console.log(newText);
      }
    }
  }
  console.log(response);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

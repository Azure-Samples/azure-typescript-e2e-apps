import { AzureOpenAI } from "openai";
import "@azure/openai/types";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";
import "dotenv/config";

// Set the Azure and AI Search values from environment variables
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const deploymentName = "gpt-4";


const searchEndpoint = process.env["AZURE_AI_SEARCH_ENDPOINT"];
const searchKey = process.env["AZURE_AI_SEARCH_API_KEY"];
const searchIndex = process.env["AZURE_AI_SEARCH_INDEX"];

const apiVersion="";

function getClient(): AzureOpenAI {
  const scope = "https://cognitiveservices.azure.com/.default";
  const azureADTokenProvider = getBearerTokenProvider(
    new DefaultAzureCredential(),
    scope
  );
  return new AzureOpenAI({ azureADTokenProvider, deployment: deploymentName, apiVersion });

}

async function main(){
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
      if (!!newText) {
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



module.exports = { main };
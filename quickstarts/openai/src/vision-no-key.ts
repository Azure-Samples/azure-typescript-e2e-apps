import { AzureOpenAI } from "openai";
import type {
  ChatCompletion,
  Completion,
  ChatCompletionCreateParamsNonStreaming,
} from "openai/resources/index";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";
import "dotenv/config";

// You will need to set these environment variables or edit the following values
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "<endpoint>";

// Azure OpenAI API version and deployment
const apiVersion = "2024-07-01-preview";
const deploymentName = "gpt-4-with-turbo";

// Set URL
const imageUrl = process.env["IMAGE_URL"] || "<image url>";

function getClient(): AzureOpenAI {
  const scope = "https://cognitiveservices.azure.com/.default";
  const azureADTokenProvider = getBearerTokenProvider(
    new DefaultAzureCredential(),
    scope
  );
  return new AzureOpenAI({ azureADTokenProvider, deployment: deploymentName, apiVersion });
}
function createMessages(): ChatCompletionCreateParamsNonStreaming {
  return {
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe this picture:",
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
    model: "",
    max_tokens: 2000,
  };
}
async function printChoices(completion: ChatCompletion): Promise<void> {
  for (const choice of completion.choices) {
    console.log(choice.message);
  }
}
export async function main() {
  console.log("== Get GPT-4 Turbo with vision Sample ==");

  const client = getClient();
  const messages = createMessages();
  const completion = await client.chat.completions.create(messages);
  await printChoices(completion);
}

main().catch((err) => {
  console.error("Error occurred:", err);
});

import "dotenv/config";
import { AzureOpenAI } from "openai";
import type {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
} from "openai/resources/index";

// You will need to set these environment variables or edit the following values
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "<endpoint>";
const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<api key>";
const imageUrl = process.env["IMAGE_URL"] || "<image url>";

// Required Azure OpenAI deployment name and API version
const apiVersion = "2024-07-01-preview";
const deploymentName = "gpt-4-with-turbo";

function getClient(): AzureOpenAI {
  return new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment: deploymentName,
  });
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

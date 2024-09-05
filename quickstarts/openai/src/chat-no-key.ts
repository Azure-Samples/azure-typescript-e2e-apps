import { AzureOpenAI } from "openai";
import {
  type ChatCompletionCreateParamsNonStreaming,
  type ChatCompletion,
} from "openai/resources/index";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";
import "dotenv/config";

const apiVersion = "2024-05-01-preview";
const deploymentName = "gpt-4o"; //This must match your deployment name.

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
        content: "Does Azure OpenAI support customer managed keys?",
      },
      {
        role: "assistant",
        content: "Yes, customer managed keys are supported by Azure OpenAI?",
      },
      { role: "user", content: "Do other Azure AI services support this too?" },
    ],
    model: "",
  };
}
async function printChoices(completion: ChatCompletion): Promise<void> {
  for (const choice of completion.choices) {
    console.log(choice.message);
  }
}
export async function main() {
  const client = getClient();
  const messages = createMessages();
  const result = await client.chat.completions.create(messages);
  await printChoices(result);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

import "dotenv/config";
import { AzureOpenAI } from "openai";
import { type Completion } from "openai/resources/index";

// You will need to set these environment variables or edit the following values
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "<endpoint>";
const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<api key>";

// Required Azure OpenAI deployment name and API version
const apiVersion = "2024-07-01-preview";
const deploymentName = "gpt-35-turbo-instruct";

// Chat prompt and max tokens
const prompt = ["When was Microsoft founded?"];
const maxTokens = 128;

function getClient(): AzureOpenAI {
  return new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment: deploymentName,
  });
}
async function getCompletion(
  client: AzureOpenAI,
  prompt: string[],
  max_tokens: number
): Promise<Completion> {
  return client.completions.create({
    prompt,
    model: "",
    max_tokens,
  });
}
async function printChoices(completion: Completion): Promise<void> {
  for (const choice of completion.choices) {
    console.log(choice.text);
  }
}
export async function main() {
  console.log("== Get completions Sample ==");

  const client = getClient();
  const completion = await getCompletion(client, prompt, maxTokens);
  await printChoices(completion);
}

main().catch((err) => {
  console.error("Error occurred:", err);
});

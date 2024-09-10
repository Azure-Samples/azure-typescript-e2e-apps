import { AzureOpenAI } from "openai";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";
import "dotenv/config";

const apiVersion = "2024-07-01";

const deploymentName = "dall-e-3";

// The prompt to generate images from
const prompt = "a monkey eating a banana";

function getClient(): AzureOpenAI {
  const scope = "https://cognitiveservices.azure.com/.default";
  const azureADTokenProvider = getBearerTokenProvider(
    new DefaultAzureCredential(),
    scope
  );
  return new AzureOpenAI({ azureADTokenProvider, deployment: deploymentName, apiVersion });
}
async function main() {
    console.log("== Batch Image Generation ==");
    const client = getClient();

    const results = await client.images.generate({
        prompt: prompt,
        size: "1024x1024",
        n: 1,
        model: "",

        style: "vivid" // or "natural"
    });
  
    for (const image of results.data) {
      console.log(`Image generation result URL: ${image.url}`);
    }
}

main().catch((err) => {
console.error("The sample encountered an error:", err);
});
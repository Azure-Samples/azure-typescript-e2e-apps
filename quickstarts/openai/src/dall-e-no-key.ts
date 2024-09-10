import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";
import "dotenv/config";
import { AzureOpenAI } from "openai";

// Required Azure OpenAI deployment name and API version
const apiVersion = "2024-07-01";
const deploymentName = "dall-e-3";

// The prompt to generate images from
const prompt = "a monkey eating a banana";
const numberOfImagesToGenerate = 1;

function getClient(): AzureOpenAI {
  const scope = "https://cognitiveservices.azure.com/.default";
  const azureADTokenProvider = getBearerTokenProvider(
    new DefaultAzureCredential(),
    scope
  );
  return new AzureOpenAI({
    azureADTokenProvider,
    deployment: deploymentName,
    apiVersion,
  });
}
async function main() {
  console.log("== Image Generation ==");

  const client = getClient();

  const results = await client.images.generate({
    prompt: prompt,
    size: "1024x1024",
    n: numberOfImagesToGenerate,
    model: "",
    style: "vivid", // or "natural"
  });

  for (const image of results.data) {
    console.log(`Image generation result URL: ${image.url}`);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

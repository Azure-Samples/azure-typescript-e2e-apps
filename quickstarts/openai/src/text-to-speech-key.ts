import "dotenv/config";
import { writeFile } from "fs/promises";
import { AzureOpenAI } from "openai";
import type { SpeechCreateParams } from "openai/resources/audio/speech";
import "openai/shims/node";

// You will need to set these environment variables or edit the following values
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "<endpoint>";
const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<api key>";
const speechFilePath =
  process.env["SPEECH_FILE_PATH"] || "<path to save the speech file>";

// Required Azure OpenAI deployment name and API version
const deploymentName = "tts";
const apiVersion = "2024-07-01-preview";

function getClient(): AzureOpenAI {
  return new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment: deploymentName,
  });
}

async function generateAudioStream(
  client: AzureOpenAI,
  params: SpeechCreateParams
): Promise<NodeJS.ReadableStream> {
  const response = await client.audio.speech.create(params);
  if (response.ok) return response.body;
  throw new Error(`Failed to generate audio stream: ${response.statusText}`);
}
export async function main() {
  console.log("== Text to Speech Sample ==");

  const client = getClient();
  const streamToRead = await generateAudioStream(client, {
    model: deploymentName,
    voice: "alloy",
    input: "the quick brown chicken jumped over the lazy dogs",
  });

  console.log(`Streaming response to ${speechFilePath}`);
  await writeFile(speechFilePath, streamToRead);
  console.log("Finished streaming");
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

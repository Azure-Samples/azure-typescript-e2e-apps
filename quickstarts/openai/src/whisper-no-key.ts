import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";
import "dotenv/config";
import { createReadStream } from "fs";
import { AzureOpenAI } from "openai";

// You will need to set these environment variables or edit the following values
const audioFilePath = process.env["AUDIO_FILE_PATH"] || "<audio file path>";

// Required Azure OpenAI deployment name and API version
const apiVersion = "2024-07-01-preview";
const deploymentName = "whisper";

function getClient() {
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

export async function main() {
  console.log("== Transcribe Audio Sample ==");

  const client = getClient();
  const result = await client.audio.transcriptions.create({
    model: "",
    file: createReadStream(audioFilePath),
  });

  console.log(`Transcription: ${result.text}`);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

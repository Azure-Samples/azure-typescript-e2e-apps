import { AzureOpenAI } from "openai";
import { createReadStream } from "fs";

// Set AZURE_OPENAI_ENDPOINT to the endpoint of your
// OpenAI resource. You can find this in the Azure portal.
// Load the .env file if it exists
import "dotenv/config";

// You will need to set these environment variables or edit the following values
const audioFilePath = process.env["AUDIO_FILE_PATH"] || "<audio file path>";

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "<endpoint>";
const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<api key>";

const apiVersion = "2024-07-01-preview";
const deploymentName = "whisper";

function getClient(): AzureOpenAI {
    return new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment: deploymentName });
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
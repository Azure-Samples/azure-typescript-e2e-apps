const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

async function main() {
  // You will need to set these environment variables or edit the following values
  const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "https://dfberry-openai-sweden.openai.azure.com/";
  const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<REPLACE_WITH_YOUR_KEY_VALUE_HERE>";
  const apiVersion = "2024-05-01-preview";
  const deployment = "gpt-4-dina"; // This must match your deployment name

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
  
  const result = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are an AI assistant that helps people find information." },
      { role: "user", content: "hello" },
      { role: "assistant", content: "Hello! How can I assist you today?" }
    ],
    past_messages: 10,
    max_tokens: 4096,
    temperature: 0.7,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: null
  });

  for (const choice of result.choices) {
    console.log(choice.message);
  }
}
main().then(() => console.log("Done")).catch((err) => console.error(err));
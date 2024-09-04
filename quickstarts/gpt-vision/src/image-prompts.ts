import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Azure OpenAI deployment
const deployment = "gpt-4";

// Image URL
const imageUrl = "https://store.acousticsounds.com/images/medium/ALTA_100RD__175756__01262023034207-9713.jpg"; // "<image URL>";

// Construct endpoint URL
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "<your_azure_openai_endpoint>";
const completionEndpoint = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=2023-12-01-preview`;
console.log(`Endpoint: ${completionEndpoint}`);

// Azure OpenAI API key
const apiKey = process.env.AZURE_OPENAI_KEY || "<your_azure_openai_key>";

const headers = {
  "Content-Type": "application/json",
  "api-key": apiKey
};

const data = {
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: [
        { type: "text", text: "Describe this picture:" },
        { type: "image_url", image_url: { url: imageUrl } }
      ]
    }
  ],
  max_tokens: 500
};

async function getChatCompletion() {
  try {
    const response = await fetch(completionEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(`Status Code: ${response.status}`);
    console.log(responseData);
  } catch (error) {
    console.error(error);
  }
}

getChatCompletion();
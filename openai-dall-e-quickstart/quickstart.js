import fetch from 'node-fetch';
import 'dotenv/config';

const apiBase = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_KEY;
const apiVersion = process.env.AZURE_OPENAI_VERSION;

// Request operation to start, poll location is in returned header
const url = `${apiBase}openai/images/generations:submit?api-version=${apiVersion}`;
const headers = { 'api-key': apiKey, 'Content-Type': 'application/json' };
const body = JSON.stringify({
  prompt: 'a multi-colored umbrella on the beach, disposable camera',
  size: '1024x1024',
  n: 1,
});

const response = await fetch(url, { method: 'POST', headers, body });

// Poll location until csucceeded
let operationLocation = response.headers.get('operation-location')
let status = '';
let imageUrl ='';

while (status != "succeeded"){

    // Give OpenAI some time to generate image
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if image is generated
    const statusResponse = await fetch(operationLocation, {method: 'GET', headers});
    const statusResponseJson = await statusResponse.json();
    imageUrl = statusResponseJson?.result?.data[0]?.url;

    // Check status
    status = statusResponseJson?.status
}
console.log(imageUrl);

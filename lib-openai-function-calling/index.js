import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_DEPLOYMENT_NAME = process.env.AZURE_DEPLOYMENT_NAME;
console.log(`AZURE_OPENAI_API_KEY: ${AZURE_OPENAI_API_KEY}`);
console.log(`AZURE_OPENAI_ENDPOINT: ${AZURE_OPENAI_ENDPOINT}`);
console.log(`AZURE_DEPLOYMENT_NAME: ${AZURE_DEPLOYMENT_NAME}`);
let ASSISTANT = undefined;
let LOCATION = "SEATTLE";
const client = new OpenAI({
    apiKey: AZURE_OPENAI_API_KEY,
    baseURL: `${AZURE_OPENAI_ENDPOINT.replace(/\/+$/, "")}/openai`,
    defaultQuery: { "api-version": "2024-02-15-preview" },
    defaultHeaders: { "api-key": AZURE_OPENAI_API_KEY },
});
const getCurrentWeather = async (location) => {
    // generate random weather for location
    const weather = Math.random() > 0.5 ? "sunny" : "rainy";
    return `The weather in ${location} is ${weather}`;
};
// Create the assistant
ASSISTANT = client.beta.assistants.create({
    instructions: "You are a weather bot. Use the provided functions to answer questions.",
    model: "gpt-4-1106-preview", //Replace with model deployment name
    tools: [{
            type: "function",
            function: {
                name: "getCurrentWeather",
                description: "Get the weather in location",
                parameters: {
                    type: "object",
                    properties: {
                        location: { type: "string", description: "The city and state e.g. San Francisco, CA" },
                    },
                    required: ["location"]
                }
            }
        }]
});
// Create a thread
const thread = await client.beta.threads.create();
// Add a user question to the thread
const message = await client.beta.threads.messages.create(thread.id, "user", "seattle" // Replace this with your prompt
);
// Run the thread
let run = await client.beta.threads.runs.create(thread.id, ASSISTANT.id);
// Looping until the run completes or fails
while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
    setTimeout(async () => {
        run = await client.beta.threads.runs.retrieve(thread.id, run.id);
    }, 1000);
}
if (run.status === 'completed') {
    const messages = await client.beta.threads.messages.list(thread.id);
    console.log(messages);
}
else if (run.status === 'requires_action') {
    // the assistant requires calling some functions
    // and submit the tool outputs back to the run
}
else {
    console.log(run.status);
}

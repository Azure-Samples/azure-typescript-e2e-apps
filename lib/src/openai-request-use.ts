import * as OpenAiManager from './openai-request';
import program, { processInput } from './openai-request-cli';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
const systemPrompt =
  process.env.AZURE_OPENAI_SYSTEM_PROMPT ||
  'Your are an Azure services expert whose primary purpose is to help customers understand how to use Azure with JavaScript and the Azure SDKs in the @azure namespace of npm package manager.';

let initialized = false;
let response: OpenAiManager.OpenAiResponse;

let openAiManager: OpenAiManager.OpenAIConversationManager;

// CLI Loop

const checkRequiredParams = (env: Record<string, string> | undefined) => {
  const errors = [];

  if (!env) {
    console.log(
      'Please set the following environment variables:\nAZURE_OPENAI_ENDPOINT\nAZURE_OPENAI_API_KEY\nAZURE_OPENAI_DEPLOYMENT\nAZURE_OPENAI_API_VERSION'
    );
    process.exit(1);
  }

  if (!env?.AZURE_OPENAI_ENDPOINT) {
    errors.push('AZURE_OPENAI_ENDPOINT');
  }
  if (!env?.AZURE_OPENAI_API_KEY) {
    errors.push('AZURE_OPENAI_API_KEY');
  }
  if (!env?.AZURE_OPENAI_DEPLOYMENT) {
    errors.push('AZURE_OPENAI_DEPLOYMENT');
  }
  if (!env?.AZURE_OPENAI_API_VERSION) {
    errors.push('AZURE_OPENAI_API_VERSION');
  }
  if (errors.length > 0) {
    console.log('Please set the following environment variables:');
    errors.forEach((error) => {
      console.log(`  ${error}`);
    });
    process.exit(1);
  }
};

const ask = async () => {
  const cliValues = await processInput();
  checkRequiredParams(cliValues?.envVars);

  // Not checking secrets before usage
  if (!initialized) {
    openAiManager = new OpenAiManager.OpenAIConversationManager(
      cliValues?.envVars?.AZURE_OPENAI_ENDPOINT as string,
      cliValues?.envVars?.AZURE_OPENAI_API_KEY as string,
      cliValues?.envVars?.AZURE_OPENAI_DEPLOYMENT as string,
      cliValues?.envVars?.AZURE_OPENAI_API_VERSION as string,
      cliValues?.envVars?.AZURE_OPENAI_SYSTEM_PROMPT as string
    );
    initialized = true;
    console.log(`User: ${cliValues?.data} ${cliValues?.inputText}`);

    // first request includes data
    response = await openAiManager.OpenAiConverationStep(
      `${cliValues?.data} ${cliValues?.inputText}`
    );
    console.log(`Assistant: ${response.choices[0].message.content}`);
    process.exit(0);
  }
};

console.log('Hello!');
ask();

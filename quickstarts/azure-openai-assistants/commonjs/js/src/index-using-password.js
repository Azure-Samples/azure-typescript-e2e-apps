require('dotenv').config();
const { AzureOpenAI } = require('openai');
const { assistant } = require('./assistant');

// Get environment variables
const azureOpenAIKey = process.env.AZURE_OPENAI_KEY;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureOpenAIDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const azureOpenAIVersion = process.env.OPENAI_API_VERSION;

// Check env variables
if (
  !azureOpenAIKey ||
  !azureOpenAIEndpoint ||
  !azureOpenAIDeployment ||
  !azureOpenAIVersion
) {
  throw new Error(
    'Please set AZURE_OPENAI_KEY and AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_DEPLOYMENT_NAME in your environment variables.'
  );
}

// Get Azure SDK client
const getClient = () => {
  const assistantsClient = new AzureOpenAI({
    endpoint: azureOpenAIEndpoint,
    apiVersion: azureOpenAIVersion,
    apiKey: azureOpenAIKey
  });
  return assistantsClient;
};
async function main() {
  const assistantsClient = getClient();
  await assistant(assistantsClient, azureOpenAIDeployment);
}

main()
  .then(() => console.log('Done'))
  .catch((ex) => console.error(ex));

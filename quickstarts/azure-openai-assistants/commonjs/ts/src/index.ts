import 'dotenv/config';
import { AzureOpenAI } from 'openai';
import { assistant } from './assistant';

// Add `Cognitive Services User` to identity for Azure OpenAI resource
import {
  DefaultAzureCredential,
  getBearerTokenProvider
} from '@azure/identity';

// Get environment variables
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT!;
const azureOpenAIDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!;
const azureOpenAIVersion = process.env.OPENAI_API_VERSION!;

// Check env variables
if (!azureOpenAIEndpoint || !azureOpenAIDeployment || !azureOpenAIVersion) {
  throw new Error(
    'Please ensure to set AZURE_OPENAI_DEPLOYMENT_NAME and AZURE_OPENAI_ENDPOINT in your environment variables.'
  );
}

// Get Azure SDK client
const getClient = (): AzureOpenAI => {
  const credential = new DefaultAzureCredential();
  const scope = 'https://cognitiveservices.azure.com/.default';
  const azureADTokenProvider = getBearerTokenProvider(credential, scope);
  const assistantsClient = new AzureOpenAI({
    endpoint: azureOpenAIEndpoint,
    apiVersion: azureOpenAIVersion,
    azureADTokenProvider
  });
  return assistantsClient;
};

async function main(): Promise<void> {
  const assistantsClient = getClient();
  await assistant(assistantsClient, azureOpenAIDeployment);
}

main()
  .then(() => console.log('Done'))
  .catch((ex) => console.error(ex));

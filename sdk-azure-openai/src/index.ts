import {
  OpenAIClient,
  AzureKeyCredential,
  GetChatCompletionsOptions,
  Completions,
  ChatMessage,
  ChatCompletions
} from '@azure/openai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

const endpoint = process.env.AZURE_OPENAI_ENDPOINT as string;
const apiKey = process.env.AZURE_OPENAI_API_KEY as string;
const deploymentOrModelName = process.env.AZURE_OPENAI_DEPLOYMENT as string;

if (!endpoint || !apiKey || !deploymentOrModelName) {
  console.log(
    'Please set the following environment variables: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT'
  );
}

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

const main = async () => {
  const messages: ChatMessage[] = [
    {
      role: 'user',
      content: 'What is typescript?'
    }
  ];

  const options: GetChatCompletionsOptions = {
    stop: ['\n', 'Human:', 'AI:'],
    maxTokens: 2000,
    temperature: 0.9,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    user: 'Human:',
    stream: false
  };

  const response: any = client.getChatCompletions(
    deploymentOrModelName,
    messages,
    options
  );
  return response;
};

main()
  .then((response) => {
    console.log(JSON.stringify(response));
  })
  .catch((error) => {
    console.log(error);
  });

import { Command, OptionValues } from 'commander';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';
import { checkRequiredEnvParams } from './settings';
import OpenAIConversationManager, {
  OpenAiResponse
} from '@azure-typescript-e2e-apps/lib-openai';

import readline from 'node:readline/promises';
dotenv.config();

const openAiManager = new OpenAIConversationManager(
  process.env.AZURE_OPENAI_ENDPOINT as string,
  process.env.AZURE_OPENAI_API_KEY as string,
  process.env.AZURE_OPENAI_DEPLOYMENT as string,
  process.env.AZURE_OPENAI_API_VERSION as string
);

const program = new Command();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

program
  .name('conversation')
  .description(
    `A conversation loop

        Examples: 
        index.js -d 'myfile.txt' -e '.env'        Start convo with text from file with settings from .env file
    `
  )
  .option(
    '-d, --dataFile <filename>',
    'Read content from a file. If both input and data file are provided, both are sent with initial request. Only input is sent with subsequent requests.'
  )
  .option(
    '-e, --envFile <filename>',
    'Load environment variables from a file. Prefer .env to individual option switches. If both are sent, .env is used only.'
  )
  .helpOption('-h, --help', 'Display help');

program.description('Start a conversation').action(async () => {
  console.log('Welcome to the OpenAI conversation!');

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    const yourQuestion: string = await askQuestion(
      'What would you like to ask? '
    );
    // Print response
    console.log(`\nYOU: ${yourQuestion}`);

    // Exit if user types 'exit'
    if (yourQuestion.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      process.exit();
    }

    await getAnswer(yourQuestion);
  }
});

async function askQuestion(question: string): Promise<string> {
  return await rl.question(question);
}
async function getAnswer(question: string): Promise<void> {
  const { status, data, error }: OpenAiResponse =
    await openAiManager.OpenAiConverationStep(question);

  if (Number(status) > 299) {
    process.stdout.write(
      `Conversation step request error: ${error?.message || 'unknown'}`
    );
    process.exit();
  }

  if (data?.choices[0]?.message) {
    process.stdout.write(
      `\n\nASSISTANT:\n\n${data?.choices[0].message.content}\n\n>(enter response or "exit" to quit): `
    );
  } else {
    // no response from assistant
    process.stdout.write(
      `\n\nASSISTANT:\n\nNo response provided.\n\n>(enter response or "exit" to quit): `
    );
  }
}

program.parse(process.argv);

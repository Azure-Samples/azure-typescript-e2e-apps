import { Command, OptionValues } from 'commander';
import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { checkRequiredEnvParams } from './settings';
import OpenAIConversationClient, {
  OpenAiResponse
} from '@azure-typescript-e2e-apps/lib-openai';

import readline from 'node:readline/promises';
import { env } from 'process';

// CLI settings
let debug = false;
let debugFile = 'debug.log';
let envFile = '.env';

// CLI client
const program = new Command();

// ReadLine client
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function printf(text: string) {
  printd(text);
  process.stdout.write(`${text}\n`);
}
function printd(text: string) {
  if (debug) {
    writeFileSync(debugFile, `${text}\n`, { flag: 'a' });
  }
}

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
    '-e, --envFile <filename>. Default: .env',
    'Load environment variables from a file. Prefer .env to individual option switches. If both are sent, .env is used only.'
  )
  .option('-l, --log <filename>. Default: debug.log', 'Log everything to file')
  .helpOption('-h, --help', 'Display help');

program.description('Start a conversation').action(async (options) => {
  // Prepare: Get debug logger
  if (options.log) {
    debug = true;
    debugFile = options?.log || 'debug.log';
  }
  printd(`CLI Options: ${JSON.stringify(options)}`);

  // Prepare: Get OpenAi settings and create client
  if (options.envFile) {
    envFile = options.envFile;
  }
  dotenv.config(options.envFile ? { path: options.envFile } : { path: '.env' });
  printd(`CLI Env file: ${envFile}`);
  printd(`CLI Env vars: ${JSON.stringify(process.env)}`);

  // Prepare: Check required environment variables
  const errors = checkRequiredEnvParams(process.env);
  if (errors.length > 0) {
    const failures = `${errors.join('\n')}`;
    printf(`CLI Required env vars failed: ${failures}`);
  } else {
    printd(`CLI Required env vars success`);
  }

  // Prepare: OpenAi Client
  const openAiClient: OpenAIConversationClient = new OpenAIConversationClient(
    process.env.AZURE_OPENAI_ENDPOINT as string,
    process.env.AZURE_OPENAI_API_KEY as string,
    process.env.AZURE_OPENAI_DEPLOYMENT as string,
    process.env.AZURE_OPENAI_API_VERSION as string
  );
  printd(`CLI OpenAi client created`);

  // Prepare: Start conversation
  printf('Welcome to the OpenAI conversation!');

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    const yourQuestion: string = await askQuestion(
      'What would you like to ask? '
    );
    // Print response
    printf(`\nYOU: ${yourQuestion}`);

    // Exit if user types 'exit'
    if (yourQuestion.toLowerCase() === 'exit') {
      printf('Goodbye!');
      process.exit();
    }

    await getAnswer(yourQuestion, openAiClient);
  }
});

async function askQuestion(question: string): Promise<string> {
  return await rl.question(question);
}
async function getAnswer(
  question: string,
  openAiClient: OpenAIConversationClient
): Promise<void> {

  // Request
  const { status, data, error }: OpenAiResponse =
    await openAiClient.OpenAiConverationStep(question);

  // Response
  printd(`CLI OpenAi response status: ${status}`);
  printd(`CLI OpenAi response data: ${JSON.stringify(data)}`);
  printd(`CLI OpenAi response error: ${error}`);

  // Error
  if (Number(status) > 299) {
    printf(`Conversation step request error: ${error?.message || 'unknown'}`);
    process.exit();
  }

  // Answer
  if (data?.choices[0]?.message) {
    printf(
      `\n\nASSISTANT:\n\n${data?.choices[0].message.content}\n\nEnter 'exit' to quit.`
    );
    return;
  }

  // No Answer
  printf(`\n\nASSISTANT:\n\nNo response provided.\n\nEnter 'exit' to quit.`);
  return;
}

program.parse(process.argv);

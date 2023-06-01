import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { checkRequiredEnvParams } from './settings';
import OpenAIConversationClient, {
  OpenAiResponse,
  DebugOptions
} from '@azure-typescript-e2e-apps/lib-openai';
import chalk from 'chalk';

import readline from 'node:readline/promises';

// CLI settings
let debug = false;
let debugFile = 'debug.log';
let envFile = '.env';

// CLI client
const program: Command = new Command();

// ReadLine client
const readlineClient = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function printf(text: string) {
  printd(text);
  process.stdout.write(`${text}\n`);
}
function printd(text: string) {
  if (debug) {
    writeFileSync(debugFile, `${new Date().toISOString()}:${text}\n`, {
      flag: 'a'
    });
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
  .option('-x, --exit', 'Exit conversation loop')
  .helpOption('-h, --help', 'Display help');

program.description('Start a conversation').action(async (options) => {
  // Prepare: Get debug logger
  if (options.log) {
    debug = true;
    debugFile = options?.log || 'debug.log';

    // reset debug file
    writeFileSync(debugFile, ``);
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
    printf(chalk.red(`CLI Required env vars failed: ${failures}`));
  } else {
    printd(`CLI Required env vars success`);
  }

  // Prepare: OpenAi Client
  const openAiClient: OpenAIConversationClient = new OpenAIConversationClient(
    process.env.AZURE_OPENAI_ENDPOINT as string,
    process.env.AZURE_OPENAI_API_KEY as string,
    process.env.AZURE_OPENAI_DEPLOYMENT as string
  );
  printd(`CLI OpenAi client created`);

  // Prepare: Start conversation
  printf(chalk.green('Welcome to the OpenAI conversation!'));

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    const yourQuestion: string = await readlineClient.question(
      chalk.green('What would you like to ask? (`exit` to stop)\n>')
    );
    // Print response
    printf(`\n${chalk.green.bold(`YOU`)}: ${chalk.gray(yourQuestion)}`);

    // Exit
    if (yourQuestion.toLowerCase() === 'exit') {
      printf(chalk.green('Goodbye!'));
      process.exit();
    }

    await getAnswer(yourQuestion, openAiClient);
  }
});

async function getAnswer(
  question: string,
  openAiClient: OpenAIConversationClient
): Promise<void> {
  // Request
  const appOptions = undefined;
  const requestOptions = undefined;
  const debugOptions: DebugOptions = {
    debug: debug,
    logger: printd
  };

  const { status, data, error }: OpenAiResponse =
    await openAiClient.OpenAiConverationStep(
      question,
      appOptions,
      requestOptions,
      debugOptions
    );

  // Response
  printd(`CLI OpenAi response status: ${status}`);
  printd(`CLI OpenAi response data: ${JSON.stringify(data)}`);
  printd(`CLI OpenAi response error: ${error}`);

  // Error
  if (Number(status) > 299) {
    printf(
      chalk.red(
        `Conversation step request error: ${error?.message || 'unknown'}`
      )
    );
    process.exit();
  }

  // Answer
  if (data?.choices[0]?.message) {
    printf(
      `\n\n${chalk.green.bold(`ASSISTANT`)}:\n\n${
        data?.choices[0].message.content
      }\n\n`
    );
    return;
  }

  // No Answer
  printf(`\n\n${chalk.green.bold(`ASSISTANT`)}:\n\nNo response provided.\n\n`);
  return;
}

program.parse(process.argv);

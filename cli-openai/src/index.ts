import { Command, OptionValues } from 'commander';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';
import { checkRequiredEnvParams } from './settings';
import OpenAIConversationManager, {
  OpenAiAppConfig,
  OpenAiError,
  OpenAiRequest,
  OpenAiRequestConfig,
  OpenAiResponse
} from '@azure-typescript-e2e-apps/lib-openai';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

function startConversation(): void {
  const program: Command = new Command();

  program
    .name('conversation')
    .description(
      `A conversation loop

        Examples: 
        index.js -d 'myfile.txt' -e '.env'        Start convo with text from file with settings from .env file
    `
    )
    .option('-i, --inputText <text>', 'Quote-delimited input text')
    .option(
      '-d, --dataFile <filename>',
      'Read content from a file. If both input and data file are provided, both are sent with initial request. Only input is sent with subsequent requests.'
    )
    .option(
      '-e, --envFile <filename>',
      'Load environment variables from a file. Prefer .env to individual option switches. If both are sent, .env is used only.'
    )
    .option('-se, --endpoint <endpoint>', 'Setting: OpenAI API endpoint')
    .option('-sk, --key <key>', 'Setting: OpenAI API key')
    .option('-sd, --deployment <deployment>', 'Setting: OpenAI API deployment')
    .option('-sv, --version <api version>', 'Setting: OpenAI API version')
    .option(
      '-sp, --prompt <system prompt>',
      'Setting: OpenAI API system prompt for deployment'
    )
    .helpOption('-h, --help', 'Display help')
    .action((options: OptionValues) => {
      console.log('options: ', options);

      // standard usage - v1
      const { dataFile, envFile } = options;

      if (!dataFile && !envFile) {
        process.stdout.write(
          'Missing data file and environment variables. Exiting...'
        );
        process.exit();
      }

      // env file
      const envPath = path.join(__dirname, '../', options.envFile);
      dotenv.config({
        path: envPath
      });
      const envErrors: string[] = checkRequiredEnvParams(
        process.env as Record<string, string>
      );
      if (envErrors.length > 0) {
        process.stdout.write(envErrors.join('\n'));
        process.exit();
      }

      // data file
      const dataPath = path.join(__dirname, '../', options.dataFile);
      const initialPrompt = readFileSync(dataPath, 'utf8');
      if (!initialPrompt) {
        process.stdout.write(
          `Initial prompt from ${options.dataFile} is empty. Exiting...`
        );
        process.exit();
      }

      // Initial conversation manager
      const openAiManager = new OpenAIConversationManager(
        process.env.AZURE_OPENAI_ENDPOINT as string,
        process.env.AZURE_OPENAI_API_KEY as string,
        process.env.AZURE_OPENAI_DEPLOYMENT as string,
        process.env.AZURE_OPENAI_API_VERSION as string,
        process.env.AZURE_OPENAI_SYSTEM_PROMPT as string
      );

      const initialRequest = {
        userText: initialPrompt,
        assistantText: 'How can I help?',
        appOptions: undefined,
        requestOptions: undefined,
        initialized: false
      };

      process.stdout.write(
        `${initialRequest.assistantText} (type "exit" to quit): `
      );
      initialRequest.initialized = true;

      /* eslint-disable-next-line no-constant-condition */
      while (1) {
        process.stdin.once('data', (input: Buffer) => {
          const userInput: string = input.toString().trim();

          if (userInput.toLowerCase() === 'exit') {
            process.stdout.write('Exiting...');
            process.exit();
          } else {
            // process user input
            openAiManager
              .OpenAiConverationStep(
                userInput,
                initialRequest.appOptions,
                initialRequest.requestOptions
              )
              .then((response: OpenAiResponse) => {
                // report response
                if (response instanceof OpenAiError) {
                  process.stdout.write(`Error: ${response.message}`);
                  process.exit();
                } else if (
                  response instanceof OpenAiResponse &&
                  response.choices.length > 0 &&
                  response.choices[0].message.length > 0
                ) {
                  process.stdout.write(
                    `\n\nASSISTANT:\n\n${response.choices[0].message.length}\n\n>(enter response or "exit" to quit): `
                  );
                } else {
                  process.stdout.write(
                    `Error: step response doesn't make sense.`
                  );
                  process.exit();
                }
              })
              .catch((error: Error) => {
                if (error instanceof Error) {
                  process.stdout.write(
                    `Conversation step unexpected error: ${error.message}`
                  );
                  process.exit(1);
                } else {
                  process.stdout.write(
                    `Conversation step unexpected error: ${error}`
                  );
                  process.exit(1);
                }
              });
          }
        });
      }
    });

  program.parse(process.argv);
}

startConversation();

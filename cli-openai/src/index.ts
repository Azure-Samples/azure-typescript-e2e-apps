import OpenAIConversationManager, {
  OpenAiAppConfig,
  OpenAiRequest,
  OpenAiRequestConfig,
  OpenAiResponse
} from '@azure-typescript-e2e-apps/lib-openai';
import { Command, OptionValues } from 'commander';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';
import { createInterface } from 'readline';
import { checkRequiredEnvParams } from './settings';

import readline from 'readline';

const program = new Command();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


program
  .command('start')
  .description('Start a conversation')
  .action(async () => {
    console.log('Welcome to the conversation!');

    /* eslint-disable-next-line no-constant-condition */
    while (true) {
      const answer: string = await askQuestion('What would you like to say? ');
      console.log(`You said: ${answer}`);

      if (answer.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        break;
      }
    }
  });

async function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

program.parse(process.argv);

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

program
  .command('start')
  .description('Start a conversation')
  .action(async () => {
    console.log('Welcome to the OpenAI conversation!');

    /* eslint-disable-next-line no-constant-condition */
    while (true) {
      const answer: string = await askQuestion('What would you like to ask? ');

      // Print response
      console.log(`You said: ${answer}`);

      // Exit if user types 'exit'
      if (answer.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        process.exit();
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

import { Command } from 'commander';
import path from 'path';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
export type CommandLineOption = {
  dataFile?: string;
  quit?: boolean;
  help?: boolean;
  envFile?: string;
  inputText?: string;
  AZURE_OPENAI_ENDPOINT: string;
  AZURE_OPENAI_API_KEY: string;
  AZURE_OPENAI_DEPLOYMENT: string;
  AZURE_OPENAI_API_VERSION: string;
  AZURE_OPENAI_SYSTEM_PROMPT: string;
};
const program = new Command();

program.version('1.0.0').description('A CLI for interacting with content');

// User's input text
program.option('-i, --inputText <text>', 'Quote-delimited input text');
program.option(
  '-d, --dataFile <filename>',
  'Read content from a file. If both input and data file are provided, both are sent with initial request. Only input is sent with subsequent requests.'
);

// Secrets
program.option(
  '-e, --envFile <filename>',
  'Load environment variables from a file. Prefer .env to individual option switches. If both are sent, .env is used only.'
);
program.option('-se, --endpoint <endpoint>', 'OpenAI API endpoint');
program.option('-sk, --key <key>', 'OpenAI API key');
program.option('-sd, --deployment <deployment>', 'OpenAI API deployment');
program.option('-sv, --version <api version>', 'OpenAI API version');
program.option(
  '-sp, --prompt <system prompt>',
  'OpenAI API system prompt for deployment'
);

program.option('-q, --quit', 'Quit the CLI');

program.option('-h, --help', 'Display help');

export function displayHelp() {
  program.helpInformation();

  console.log(`  
    Examples:  

    $ my-cli.js -d 'myfile.txt' -e '.env'        Read content from a file 
    $ my-cli.js -i 'My input text' -e '.env'     Send input text 
    $ my-cli.js -q                               Quit the CLI  
    $ my-cli.js -h                               Display help  
  `);
}
type EnvVars = Record<string, string>;
type CliValues = {
  envVars: EnvVars;
  data: string;
  inputText: string;
};

let initialized = false;

const cliValues: CliValues = {
  envVars: {
    AZURE_OPENAI_ENDPOINT: '',
    AZURE_OPENAI_API_KEY: '',
    AZURE_OPENAI_DEPLOYMENT: '',
    AZURE_OPENAI_API_VERSION: '',
    AZURE_OPENAI_SYSTEM_PROMPT: ''
  },
  data: '',
  inputText: ''
};
export function processInput(): CliValues | undefined {
  program.parse(process.argv);

  const options: CommandLineOption = program.opts();

  // Display help - stop processing
  if (options.help) {
    displayHelp();
    process.exit(0);
  }

  // Quit the CLI - stop processing
  if (options.quit) {
    console.log('Goodbye!');
    process.exit(0);
  }

  // Continue processing input

  // Load secrets - settings
  if (options.envFile) {
    const envPath = path.join(__dirname, '../', options.envFile);
    dotenv.config({
      path: envPath
    });

    cliValues.envVars.AZURE_OPENAI_ENDPOINT = process.env
      .AZURE_OPENAI_ENDPOINT as string;
    cliValues.envVars.AZURE_OPENAI_API_KEY = process.env
      .AZURE_OPENAI_API_KEY as string;
    cliValues.envVars.AZURE_OPENAI_DEPLOYMENT = process.env
      .AZURE_OPENAI_DEPLOYMENT as string;
    cliValues.envVars.AZURE_OPENAI_API_VERSION = process.env
      .AZURE_OPENAI_API_VERSION as string;
    cliValues.envVars.AZURE_OPENAI_SYSTEM_PROMPT = process.env
      .AZURE_OPENAI_SYSTEM_PROMPT as string;
  } else {
    cliValues.envVars = {
      AZURE_OPENAI_ENDPOINT: options.AZURE_OPENAI_ENDPOINT as string,
      AZURE_OPENAI_API_KEY: options.AZURE_OPENAI_API_KEY as string,
      AZURE_OPENAI_DEPLOYMENT: options.AZURE_OPENAI_DEPLOYMENT,
      AZURE_OPENAI_API_VERSION: options.AZURE_OPENAI_API_VERSION,
      AZURE_OPENAI_SYSTEM_PROMPT: options.AZURE_OPENAI_SYSTEM_PROMPT
    };
  }

  // Read data from file
  // data is used in initial request only
  if (!initialized && options.dataFile) {
    cliValues.data = readFileSync(
      path.join(__dirname, options.dataFile),
      'utf-8'
    );
    initialized = true;
  }

  // Read input text - this will be the text submitted
  // as conversation continues
  if (options.inputText?.trim() && options.inputText?.trim().length > 0) {
    cliValues.inputText = options.inputText.trim();
  }

  return cliValues;
}

export default program;

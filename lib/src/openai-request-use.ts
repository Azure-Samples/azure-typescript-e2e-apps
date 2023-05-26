import * as OpenAiManager from './openai-request';
import { Command } from 'commander';
import { config as dotenv } from 'dotenv';
import { readFileSync } from 'fs';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
const systemPrompt =
  process.env.AZURE_OPENAI_SYSTEM_PROMPT ||
  'Your are an Azure services expert whose primary purpose is to help customers understand how to use Azure with JavaScript and the Azure SDKs in the @azure namespace of npm package manager.';

const openAiManager = new OpenAiManager.OpenAIConversationManager(
  endpoint as string,
  apiKey as string,
  deployment as string,
  apiVersion as string,
  systemPrompt
);

type CommandLineOption = {
  data?: string;
  quit?: boolean;
  help?: boolean;
  env?: string;
};

const program = new Command();

program.version('1.0.0').description('A CLI for interacting with content');

program
  .command('input [content]')
  .alias('i')
  .description('Input content')
  .action((content: string) => {
    console.log(`You entered: ${content}`);
  });

program.option('-d, --data <filename>', 'Read content from a file');

program.option(
  '-e, --env <filename>',
  'Load environment variables from a file'
);

program.option('-q, --quit', 'Quit the CLI');

program.option('-h, --help', 'Display help');

program.parse(process.argv);

const options: CommandLineOption = program.opts();

if (options.help) {
  program.helpInformation();

  console.log(`  
    Examples:  
    $ my-cli.js input "Hello, world!"            Input content  
    $ my-cli.js -d myfile.txt                   Read content from a file  
    $ my-cli.js -e .env                          Load environment variables from a file  
    $ my-cli.js -q                               Quit the CLI  
    $ my-cli.js -h                               Display help  
  `);

  process.exit(0);
}

if (options.quit) {
  console.log('Goodbye!');
  process.exit(0);
}

if (options.env) {
  const envConfig = dotenv({ path: options.env }).parsed;
  if (envConfig) {
    for (const key in envConfig) {
      process.env[key] = envConfig[key];
    }
  }
}

if (options.data) {
  const fileContent = readFileSync(options.data, 'utf-8');
  console.log(`Content from file: ${fileContent}`);
}

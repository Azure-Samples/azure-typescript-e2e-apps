import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

import { DefaultAzureCredential } from "@azure/identity";  
import { SecretClient } from "@azure/keyvault-secrets";  

const credential = new DefaultAzureCredential({}); 

const vaultName = process.env.KEY_VAULT_NAME;  
const url = `https://${vaultName}.vault.azure.net`;  
const client = new SecretClient(url, credential); 


for await (const secretProperties of client.listPropertiesOfSecrets()){

  // do something with properties
  console.log(`Secret name: ${secretProperties.name}`);
}
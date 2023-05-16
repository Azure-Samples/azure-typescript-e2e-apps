import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const credential = new DefaultAzureCredential({});

const vaultName = process.env.KEY_VAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(url, credential);

// 5 secrets per page
const maxResults = 5;
let pageCount = 1;
let itemCount=1;

// loop through all secrets
for await (const page of client.listDeletedSecrets().byPage({ maxPageSize: maxResults })) {

  let itemOnPageCount = 1;

  // loop through each secret on page
  for (const secretProperties of page) {
    
    console.log(`Page:${pageCount++}, item:${itemOnPageCount++}:${secretProperties.name}`);
    
    itemCount++;
  }
}
console.log(`Total # of secrets:${itemCount}`);
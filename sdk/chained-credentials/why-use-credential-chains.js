import { ManagedIdentityCredential, AzureCliCredential } from "@azure/identity";

let credential;

// Without chained credentials, you have to detect environment
if (process.env.production) {
    credential = new ManagedIdentityCredential("<YOUR_CLIENT_ID>");
} else {
    credential = new AzureCliCredential();
}
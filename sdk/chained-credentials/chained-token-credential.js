import { 
    ChainedTokenCredential, 
    ManagedIdentityCredential, 
    AzureCliCredential 
} from "@azure/identity";

const credential = new ChainedTokenCredential(
    new ManagedIdentityCredential("<YOUR_CLIENT_ID>"),
    new AzureCliCredential()
);
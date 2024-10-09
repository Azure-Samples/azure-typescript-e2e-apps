const { ChainedTokenCredential, ManagedIdentityCredential, AzureCliCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

const credential = new ChainedTokenCredential(
    new ManagedIdentityCredential(),
    new AzureCliCredential()
);

const blobServiceClient = new BlobServiceClient(
    "https://dinaberrystor.blob.core.windows.net",
    credential
);

const containerName = "my-data";

// get container properties
const containerClient = blobServiceClient.getContainerClient(containerName);

async function main(){
const properties = await containerClient.getProperties();
console.log(properties);
}

main().catch((err) => {
    console.error("Error running sample:", err.message);
});
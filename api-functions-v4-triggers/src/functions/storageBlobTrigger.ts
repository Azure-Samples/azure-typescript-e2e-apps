import { app, InvocationContext } from "@azure/functions";

export async function storageBlobTrigger(blob: Buffer, context: InvocationContext): Promise<void> {
    context.log(`Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`);
}

app.storageBlob('storageBlobTrigger', {
    path: 'samples-workitems/{name}',
    connection: '',
    handler: storageBlobTrigger
});

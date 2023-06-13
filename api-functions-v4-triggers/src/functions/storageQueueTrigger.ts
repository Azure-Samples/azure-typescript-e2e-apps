import { app, InvocationContext } from "@azure/functions";

export async function storageQueueTrigger(queueItem: unknown, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem);
}

app.storageQueue('storageQueueTrigger', {
    queueName: 'js-queue-items',
    connection: '',
    handler: storageQueueTrigger
});

import { app, InvocationContext } from "@azure/functions";

export async function serviceBusQueueTrigger(message: unknown, context: InvocationContext): Promise<void> {
    context.log('Service bus queue function processed message:', message);
}

app.serviceBusQueue('serviceBusQueueTrigger', {
    connection: '',
    queueName: 'myinputqueue',
    handler: serviceBusQueueTrigger
});

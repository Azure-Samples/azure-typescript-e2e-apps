import { app, InvocationContext } from "@azure/functions";

export async function serviceBusTopicTrigger(message: unknown, context: InvocationContext): Promise<void> {
    context.log('Service bus topic function processed message:', message);
}

app.serviceBusTopic('serviceBusTopicTrigger', {
    connection: '',
    topicName: 'mytopic',
    subscriptionName: 'mysubscription',
    handler: serviceBusTopicTrigger
});

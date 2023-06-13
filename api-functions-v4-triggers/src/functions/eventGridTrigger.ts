import { app, EventGridEvent, InvocationContext } from "@azure/functions";

export async function eventGridTrigger(event: EventGridEvent, context: InvocationContext): Promise<void> {
    context.log('Event grid function processed event:', event);
}

app.eventGrid('eventGridTrigger', {
    handler: eventGridTrigger
});

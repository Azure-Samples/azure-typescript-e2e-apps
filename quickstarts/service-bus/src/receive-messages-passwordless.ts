import { delay, ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";
import { DefaultAzureCredential } from "@azure/identity";

const credential = new DefaultAzureCredential();

const azureServiceBusResourceName = process.env
  .AZURE_SERVICE_BUS_RESOURCE_NAME as string;

const subscriptionName = process.env
  .AZURE_SERVICE_BUS_TOPIC_SUBSCRIPTION_NAME as string;
const queueOrTopicName = subscriptionName
  ? (process.env.AZURE_SERVICE_TOPIC_NAME as string)
  : (process.env.AZURE_SERVICE_QUEUE_NAME as string);

console.log("Queue or topic: ", queueOrTopicName);

const fullyQualifiedNamespace = `${azureServiceBusResourceName}.servicebus.windows.net`;

const serviceBusClient = new ServiceBusClient(
  fullyQualifiedNamespace,
  credential,
);

async function subscribeToMessages(receiver: any) {
  receiver.subscribe({
    processMessage: (messageReceived: ServiceBusMessage) =>
      console.log(`Received message: ${messageReceived.body}`),
    processError: (error: Error) => console.log(error),
  });
}

async function main(
  serviceBusClient: ServiceBusClient,
  queueOrTopic: string,
  subscription: string | undefined,
) {
  // create a receiver to the subscription
  const receiver = subscription
    ? serviceBusClient.createReceiver(queueOrTopic, subscription)
    : serviceBusClient.createReceiver(queueOrTopic);

  try {
    // get messages
    await subscribeToMessages(receiver);
    await delay(5000);
  } catch (error) {
    console.error("Error occurred while sending messages:", error);
  } finally {
    await receiver.close();
    await serviceBusClient.close();
  }
}

await main(serviceBusClient, queueOrTopicName, subscriptionName);

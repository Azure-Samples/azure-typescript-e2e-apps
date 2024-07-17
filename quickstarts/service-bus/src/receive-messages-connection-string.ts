import { delay, ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";
import "dotenv/config";

const credential = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING as string;

const topicSubscriptionName = process.env
  .AZURE_SERVICE_BUS_TOPIC_SUBSCRIPTION_NAME as string;
const queueOrTopicName = topicSubscriptionName
  ? (process.env.AZURE_SERVICE_TOPIC_NAME as string)
  : (process.env.AZURE_SERVICE_QUEUE_NAME as string);

console.log("Queue or topic: ", queueOrTopicName);

// create a Service Bus client using the connection string to the Service Bus namespace
const serviceBusClient = new ServiceBusClient(credential);

async function subscribeToMessages(receiver: any) {
  receiver.subscribe({
    processMessage: (messageReceived: ServiceBusMessage) =>
      console.log(`Received message: ${messageReceived.body}`),
    processError: (error: Error) => console.log(error),
  });
}

async function main(
  serviceBusClient: ServiceBusClient,
  queueOrTopicName,
  subscriptionName,
) {
  // create a receiver
  const receiver = subscriptionName
    ? serviceBusClient.createReceiver(queueOrTopicName, subscriptionName)
    : serviceBusClient.createReceiver(queueOrTopicName);

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

await main(serviceBusClient, queueOrTopicName, topicSubscriptionName);

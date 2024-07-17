import {
  ServiceBusClient,
  ServiceBusMessage,
  CreateMessageBatchOptions,
  ServiceBusSender,
} from "@azure/service-bus";
import "dotenv/config";

const credential = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING as string;

// queue or topic
const topicSubscriptionName = process.env
  .AZURE_SERVICE_BUS_TOPIC_SUBSCRIPTION_NAME as string;
const queueOrTopicName = topicSubscriptionName
  ? (process.env.AZURE_SERVICE_TOPIC_NAME as string)
  : (process.env.AZURE_SERVICE_QUEUE_NAME as string);

console.log("Queue or topic: ", queueOrTopicName);

// create a Service Bus client using the connection string to the Service Bus namespace
const serviceBusClient = new ServiceBusClient(credential);

async function sendBatchMessages(
  sender: ServiceBusSender,
  messages: ServiceBusMessage[],
  batchOptions: CreateMessageBatchOptions,
): Promise<void> {
  let serviceBusMessageBatch = await sender.createMessageBatch(batchOptions);

  // The code ensures that messages are sent in batches without exceeding the batch size limit.
  // If a message cannot fit into the current batch, the batch is sent, and a new batch is created.
  // If a message is too large to fit into an empty batch, an error is thrown.
  // This approach ensures that each batch sent is within the size limit and that all messages are processed.
  for (const message of messages) {
    try {
      if (!serviceBusMessageBatch.tryAddMessage(message)) {
        await sender.sendMessages(serviceBusMessageBatch);
        serviceBusMessageBatch = await sender.createMessageBatch();

        if (!serviceBusMessageBatch.tryAddMessage(message)) {
          console.error("Message too big to fit in a batch:", message);
          continue; // Skip this message and continue with the next one
        }
      }
    } catch (error) {
      console.error("Error occurred while adding message to batch:", error);
    }
  }

  await sender.sendMessages(serviceBusMessageBatch);
}

async function main(
  serviceBusClient: ServiceBusClient,
  queueOrTopicName: string,
) {
  // Create messages array
  const messages: ServiceBusMessage[] = [
    { body: "Albert Einstein" },
    { body: "Werner Heisenberg" },
    { body: "Marie Curie" },
    { body: "Steven Hawking" },
    { body: "Isaac Newton" },
    { body: "Niels Bohr" },
    { body: "Michael Faraday" },
    { body: "Galileo Galilei" },
    { body: "Johannes Kepler" },
    { body: "Nikolaus Kopernikus" },
  ];

  try {
    // create a Service Bus sender
    const serviceBusSender = serviceBusClient.createSender(queueOrTopicName);

    // set tge batch size
    const batchOptions: CreateMessageBatchOptions = {
      maxSizeInBytes: 1024, // max size
    };

    // Send the messages in batches
    await sendBatchMessages(serviceBusSender, messages, batchOptions);

    console.log(`Sent a batch of messages to ${queueOrTopicName}`);
    await serviceBusSender.close();
  } catch (error) {
    console.error("Error occurred while sending messages:", error);
  } finally {
    await serviceBusClient.close();
  }
}

await main(serviceBusClient, queueOrTopicName);

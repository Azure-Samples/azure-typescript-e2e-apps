import {
  ServiceBusClient,
  ServiceBusSender,
  ServiceBusMessageBatch,
} from "@azure/service-bus";

const connectionString = "<SERVICE BUS NAMESPACE CONNECTION STRING>";
const topicName = "<TOPIC NAME>";

const messages = [
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

async function main() {
  // create a Service Bus client using the connection string to the Service Bus namespace
  const serviceBusClient = new ServiceBusClient(connectionString);

  // createSender() can also be used to create a sender for a queue.
  const serviceBusSender: ServiceBusSender = serviceBusClient.createSender(topicName);

  try {
    // Tries to send all messages in a single batch.
    // Will fail if the messages cannot fit in a batch.
    // await sender.sendMessages(messages);

    // create a batch object
    let serviceBusMessageBatch: ServiceBusMessageBatch =
      await serviceBusSender.createMessageBatch();
    for (let i = 0; i < messages.length; i++) {
      // for each message in the array

      // try to add the message to the batch
      if (!serviceBusMessageBatch.tryAddMessage(messages[i])) {
        // if it fails to add the message to the current batch
        // send the current batch as it is full
        await serviceBusSender.sendMessages(serviceBusMessageBatch);

        // then, create a new batch
        serviceBusMessageBatch = await serviceBusSender.createMessageBatch();

        // now, add the message failed to be added to the previous batch to this batch
        if (!serviceBusMessageBatch.tryAddMessage(messages[i])) {
          // if it still can't be added to the batch, the message is probably too big to fit in a batch
          throw new Error("Message too big to fit in a batch");
        }
      }
    }

    // Send the last created batch of messages to the topic
    await serviceBusSender.sendMessages(serviceBusMessageBatch);

    console.log(`Sent a batch of messages to the topic: ${topicName}`);

    // Close the sender
    await serviceBusSender.close();
  } finally {
    await serviceBusSender.close();
  }
}

// call the main function
main().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});

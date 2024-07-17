import {
  delay,
  ServiceBusClient,
  ServiceBusMessage,
  ServiceBusReceiver,
  ProcessErrorArgs,
} from "@azure/service-bus";

const connectionString: string = "<SERVICE BUS NAMESPACE CONNECTION STRING>";
const topicName: string = "<TOPIC NAME>";
const subscriptionName: string = "<SUBSCRIPTION NAME>";

async function main(): Promise<void> {
  // create a Service Bus client using the connection string to the Service Bus namespace
  const serviceBusClient = new ServiceBusClient(
    connectionString,
  );

  // createReceiver() can also be used to create a receiver for a queue.
  const serviceBusReceiver: ServiceBusReceiver =
    serviceBusClient.createReceiver(topicName, subscriptionName);

  // function to handle messages
  const myMessageHandler = async (
    messageReceived: ServiceBusMessage,
  ): Promise<void> => {
    console.log(`Received message: ${messageReceived.body}`);
  };

  // function to handle any errors
  const myErrorHandler = async (error: ProcessErrorArgs): Promise<void> => {
    console.log(error);
  };

  // subscribe and specify the message and error handlers
  serviceBusReceiver.subscribe({
    processMessage: myMessageHandler,
    processError: myErrorHandler,
  });

  // Waiting long enough before closing the sender to send messages
  await delay(5000);

  await serviceBusReceiver.close();
  await serviceBusClient.close();
}

// call the main function
main().catch((err: Error) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});

import { delay, ServiceBusClient, ServiceBusMessage, ProcessErrorArgs, ServiceBusReceiver } from "@azure/service-bus";
import { DefaultAzureCredential } from "@azure/identity";

// Replace `<SERVICE-BUS-NAMESPACE>` with your namespace
const fullyQualifiedNamespace = "<SERVICE-BUS-NAMESPACE>.servicebus.windows.net";

// Passwordless credential
const credential = new DefaultAzureCredential();

// name of the queue
const queueName = "<QUEUE NAME>"

 async function main() {
    // create a Service Bus client using the passwordless authentication to the Service Bus namespace
    const serviceBusClient = new ServiceBusClient(fullyQualifiedNamespace, credential);

    // createReceiver() can also be used to create a receiver for a subscription.
    const serviceBusReceiver: ServiceBusReceiver = serviceBusClient.createReceiver(queueName);

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
    await delay(20000);

    await serviceBusReceiver.close();
    await serviceBusReceiver.close();
}
// call the main function
main().catch((err) => {
    console.log("Error occurred: ", err);
    process.exit(1);
 });
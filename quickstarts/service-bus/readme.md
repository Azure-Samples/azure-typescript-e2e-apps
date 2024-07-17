# Azure Service Bus

- Send messages to a topic or queue with the [Send message](./src/send-messages-connection-string.ts) source code
- Subscript to a topic or queue with the [Receive message](./src/receive-messages-connection-string.ts) source code

To determine if it is a queue or topic in the receive messages source code, that is determined by whether the topic subscription name has a value in the environment variables.

```env
AZURE_SERVICE_BUS_RESOURCE_NAME=""
AZURE_SERVICE_BUS_CONNECTION_STRING=""
AZURE_SERVICE_QUEUE_NAME="myqueue"
AZURE_SERVICE_TOPIC_NAME="mytopic"
AZURE_SERVICE_BUS_TOPIC_SUBSCRIPTION_NAME="mytopic-subscription"
```

For topics: the `serviceBusClient.createReceiver(topicName, subscriptionName)` method needs the subscription as a second parameter.

## Documentation

- [Azure Service Documentation](https://learn.microsoft.com/azure/service-bus-messaging)

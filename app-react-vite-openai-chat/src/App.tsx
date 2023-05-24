import React, { useState } from "react";
import AppSettingsForm, {
  OpenAiAppConfig,
  defaultAppConfig,
} from "./components/AppConfig";
import SettingsForm, {
  OpenAiRequestConfig,
  defaultConfig,
} from "./components/RequestConfig";
import ConversationSettingsForm, {
  ConversationConfig,
  defaultConversationConfig,
} from "./components/ConversationConfig";
import TextBoxForm from "./components/TextBoxForm";
import ConversationLog from "./components/ConversationLog";
import "./App.css";
import { OpenAiRequest, OpenAiResponse, Message } from "./lib/openai-request";
import MessageDisplay from "./components/MessageDisplay";
import OpenAiResponseDisplay from "./components/OpenAiResponseDisplay";

const Chatbot = () => {
  const [appConfig, setAppConfig] = useState<OpenAiAppConfig>(defaultAppConfig);
  const [conversationConfig, setConversationConfig] =
    useState<ConversationConfig>(defaultConversationConfig);

  const systemDefinition = {
    role: "system",
    content: conversationConfig.systemContent,
  };
  //const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [systemDefinition]
  );
  const [lastOpenAiResponse, setLastOpenAiResponse] = useState<
    OpenAiResponse | undefined
  >(undefined);
  const [config, setRequestConfig] =
    useState<OpenAiRequestConfig>(defaultConfig);
  const [error, setError] = useState<string | undefined>(undefined);

  const sendMessage = (userText: string) => {
    console.log(userText);

    const userMessage = {
      role: "user",
      content: userText,
    };

    setError(undefined);
    // Messages start with system definition, then user input, then assistant response
    // repeating the user input and assistant response until the conversation is complete
    const request: OpenAiRequest = {
      conversation: {
        systemPrompt: {
          role: "system",
          content: conversationConfig.systemContent,
        },
        messages: [
          ...messages,
          userMessage,
        ],
      },
      appConfig,
      requestConfig: config,
    };
    console.log(request);
    console.log(`Conversation length: ${messages.length}`);

    OpenAiRequest(request)
      .then((data: OpenAiResponse) => {
        console.log(`Response: ${JSON.stringify(data)}`);
        const returnedAnswer: Message = data.choices[0]?.message;
        console.log(`Returned answer: ${JSON.stringify(returnedAnswer)}`)
        setLastOpenAiResponse(data);

        const newAnswers = [...messages, userMessage, returnedAnswer];
        console.log(`New answers: ${JSON.stringify(newAnswers)}`)
        setMessages(newAnswers);
      })
      .catch((error: unknown) => {
        console.log(`Error: ${JSON.stringify(error)}`);
        setError(JSON.stringify(error));
      });
  };

  return (
    <>
      <AppSettingsForm onSubmit={setAppConfig} />
      <ConversationSettingsForm onSubmit={setConversationConfig} />
      <SettingsForm onSubmit={setRequestConfig} />
      <div className="chatbot-container">
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <MessageDisplay
              key={index}
              content={message.content}
              role={message.role}
            />
          ))}
        </div>
        <TextBoxForm onSubmit={sendMessage} />
      </div>
      {error && <div className="errors">{error}</div>}
      <ConversationLog messages={messages} />
      {lastOpenAiResponse && (
        <OpenAiResponseDisplay response={lastOpenAiResponse} />
      )}
    </>
  );
};

export default Chatbot;

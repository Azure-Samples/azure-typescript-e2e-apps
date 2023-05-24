import React, { useState } from "react";
import Message from "./components/Message";
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
import "./App.css";

type Message = {
  role: string;
  content: string;
};

type OpenAiRequest = {
  messages: Message[];
} & OpenAiRequestConfig;

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];

type JSONData = Record<string, JSONValue>;

type Choice = {
  message: {
    content: string;
  };
};

type OpenAiResponse = Choice[];

const Chatbot = () => {
  const [appConfig, setAppConfig] = useState<OpenAiAppConfig>(defaultAppConfig);
  const [conversationConfig, setConversationConfig] =
    useState<ConversationConfig>(defaultConversationConfig);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [config, setRequestConfig] =
    useState<OpenAiRequestConfig>(defaultConfig);
  const [error, setError] = useState<string | undefined>(undefined);

  const systemDefinition = {
    role: "system",
    content: conversationConfig.systemContent,
  };
  const assistantDefinition = {
    role: "assistant",
    content: conversationConfig.assistantContent,
  };

  const sendMessage = (userText: string) => {
    console.log(userText);

    setError(undefined);
    const userChatInput = {
      role: "user",
      content: userText,
    };

    const request: OpenAiRequest = {
      messages: [systemDefinition, assistantDefinition, userChatInput],
      ...config,
    };
    console.log(request);

    fetch(
      `${appConfig.endpoint}/openai/deployments/${appConfig.deployment}/chat/completions?api-version=${appConfig.apiVersion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": appConfig.apiKey,
        },
        body: JSON.stringify(request),
      }
    )
      .then((response) => response.json())
      .then((data: JSONData) => {
        console.log(data);

        if (
          data.choices &&
          Array.isArray(data.choices) &&
          data.choices.length > 0
        ) {
          const choices: OpenAiResponse = data.choices as OpenAiResponse;

          console.log(choices);
          const responseText: string =
            choices[0].message.content || "No answer found";

          console.log(responseText);
          setMessages([
            ...messages,
            { role: "user", content: `${userText}\n\n` },
            { role: "bot", content: `${responseText}\n\n` },
          ]);
        }
        setMessage("");
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setError(error?.message);
        } else {
          setError("An error occured");
        }
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
            <Message
              key={index}
              content={message.content}
              role={message.role}
            />
          ))}
        </div>
        <TextBoxForm onSubmit={sendMessage} />
      </div>
      {message && <div>{message}</div>}
      {error && <div className="errors">{error}</div>}
    </>
  );
};

export default Chatbot;

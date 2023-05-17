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
import "./App.css";

type Message = {
  role: string;
  content: string;
};

type OpenAiRequest = {
  messages: Message[];
} & OpenAiRequestConfig;

const Chatbot = () => {
  const [appConfig, setAppConfig] = useState<OpenAiAppConfig>(defaultAppConfig);
  const [conversationConfig, setConversationConfig] =
    useState<ConversationConfig>(defaultConversationConfig);
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  const [config, setRequestConfig] =
    useState<OpenAiRequestConfig>(defaultConfig);
  const [error, setError] = useState<string | undefined>(undefined);

  const sendMessage = async (userText: string) => {
    setError(undefined);
    const userChatInput = {
      role: "user",
      content: userText,
    };
    const systemDefinition = {
      role: "system",
      content: conversationConfig.systemContent,
    };
    const assistantDefinition = {
      role: "assistant",
      content: conversationConfig.assistantContent,
    };
    const request: OpenAiRequest = {
      messages: [systemDefinition, assistantDefinition, userChatInput],
      ...config,
    };

    try {
      const response = await fetch(
        `${appConfig.endpoint}/openai/deployments/${appConfig.deployment}/chat/completions?api-version=${appConfig.apiVersion}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": appConfig.apiKey,
          },
          body: JSON.stringify(request),
        }
      );

      if (response.ok) {
        const data = await response.json();

        const responseText =
          data?.choices[0]?.message?.content || "No answer found";

        setMessages([
          ...messages,
          { text: userText + "\n\n", sender: "user" },
          { text: responseText + "\n\n", sender: "bot" },
        ]);
      } else {
        throw new Error(
          `Error fetching response from OpenAI API: ${response.status} ${JSON.stringify(response)}`
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error?.message);
      } else {
        setError(JSON.stringify(error));
      }
    }
  };

  return (
    <>
      <AppSettingsForm onSubmit={setAppConfig} />
      <ConversationSettingsForm onSubmit={setConversationConfig} />
      <SettingsForm onSubmit={setRequestConfig} />
      <div className="chatbot-container">
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <Message key={index} text={message.text} sender={message.sender} />
          ))}
        </div>
        <textarea
          className="chatbot-input"
          placeholder="Type your message..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendMessage((event.target as HTMLInputElement).value);
              (event.target as HTMLInputElement).value = "";
            }
          }}
        />
      </div>
      {error && <div className="errors">{error}</div>}
    </>
  );
};

export default Chatbot;

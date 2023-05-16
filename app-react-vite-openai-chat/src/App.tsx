import React, { useState } from 'react';
import Message from './components/Message';
import './App.css';

type Message = {
  role: string
  content: string
}

type OpenAiRequest= {
  messages: Message[]
  max_tokens: number
  temperature: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  stop: string[] | null
}

const Chatbot = () => {

  const openAiConfig = {
    endpoint: import.meta.env.VITE_OPENAI_ENDPOINT,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    deployment: import.meta.env.VITE_OPENAI_DEPLOYMENT,
  }
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);

  const systemDefinition = {
    role: 'system',
    content: 'Your are an Azure services expert whose primary purpose is to help customers understand how to use Azure with JavaScript and the Azure SDKs in the @azure namespace of npm package manager.'
  }
  const assistantDefinition = {
    "role": "assistant",
    "content": "I am an Azure JavaScript developer expert. I can help you use the Azure SDKs for JavaScript."
  }


  console.log(JSON.stringify(openAiConfig));

  const sendMessage = async (userText: string) => {

    const userChatInput = {
      role: 'user',
      content: userText
    }

    const request:OpenAiRequest = {
      "messages": [systemDefinition, assistantDefinition, userChatInput],
      "max_tokens": 800,
      "temperature": 0,
      "frequency_penalty": 0,
      "presence_penalty": 0,
      "top_p": 0.95,
      "stop": null
    };

    try {
      const response = await fetch(`${openAiConfig.endpoint}/openai/deployments/${openAiConfig.deployment}/chat/completions?api-version=2023-03-15-preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': openAiConfig.apiKey
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      const responseText = data?.choices[0]?.message?.content || "No answer found";

      setMessages([...messages, { "text": userText  + "\n\n", "sender": "user" },  { "text": responseText + "\n\n", "sender": "bot" }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
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
          if (event.key === 'Enter') {
            sendMessage((event.target as HTMLInputElement).value);
            (event.target as HTMLInputElement).value = '';
          }
        }}
      />
      
    </div>
    </>
  );
};

export default Chatbot;

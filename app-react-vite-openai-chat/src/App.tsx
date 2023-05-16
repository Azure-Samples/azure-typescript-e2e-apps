import React, { useState } from 'react';
import Message from './components/Message';
import './App.css';

const Chatbot = () => {

  const openAiConfig = {
    endpoint: import.meta.env.VITE_OPENAI_ENDPOINT,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    orgId: import.meta.env.VITE_OPENAI_ORG_ID,
  }
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);

  console.log(JSON.stringify(openAiConfig));

  const sendMessage = async (text: string) => {
    const newMessage = {
      text,
      sender: 'user',
    };

    setMessages([...messages, newMessage]);

    try {
      const response = await fetch(`${openAiConfig.endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiConfig.apiKey}`,
          'OpenAI-Organization': openAiConfig.orgId,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          messages:[
            {
              role: 'user',
              content: text,
            }
          ],
        }),
      });

      const data = await response.json();

      const botReply = {
        text: data.message,
        sender: 'bot',
      };

      setMessages([...messages, botReply]);
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
      <input
        className="chatbot-input"
        type="text"
        placeholder="Type your message..."
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            sendMessage((event.target as HTMLInputElement).value);
            (event.target as HTMLInputElement).value = '';
          }
        }}
      />
      
    </div>
    <div>{JSON.stringify(openAiConfig)}</div>
    </>
  );
};

export default Chatbot;

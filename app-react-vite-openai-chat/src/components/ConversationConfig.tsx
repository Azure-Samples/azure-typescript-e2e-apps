import React, { useState } from "react";

export type ConversationConfig = {
  systemContent: string;
  assistantContent: string;
};
interface SettingsFormProps {
  onSubmit: (ConversationConfig) => void;
}

export const defaultConversationConfig: ConversationConfig = {
  systemContent:
    "Your are an Azure services expert whose primary purpose is to help customers understand how to use Azure with JavaScript and the Azure SDKs in the @azure namespace of npm package manager.",
  assistantContent:
    "I am an Azure JavaScript and TypeScript developer expert. I can help you use the Azure SDKs for JavaScript.",
};

const ConversationSettingsForm: React.FC<SettingsFormProps> = ({
  onSubmit,
}) => {
  const [systemContent, setSystemContent] = useState<string>(
    defaultConversationConfig.systemContent
  );
  const [assistantContent, setAssistantContent] = useState<string>(
    defaultConversationConfig.assistantContent
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
      onSubmit({ systemContent, assistantContent });
    }
  };
  return (
    <details className="detail-container">
      <summary>Conversation settings</summary>
      <form onSubmit={handleSubmit}>
        <label>
          System role:
          <input
            type="string"
            value={systemContent}
            onChange={(event) => setSystemContent(event.target.value.trim())}
          />
        </label>
        <br />
        <label>
          Assistant:
          <input
            type="string"
            value={assistantContent}
            onChange={(event) => setAssistantContent(event.target.value.trim())}
          />
        </label>
        <br /> <button type="submit">Submit</button>
      </form>
    </details>
  );
};
export default ConversationSettingsForm;

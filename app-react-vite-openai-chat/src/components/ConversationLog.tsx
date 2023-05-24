import React from "react";

type Message = {
  role: string;
  content: string;
};
type ConversationLogProps = {
  messages: Message[];
};

const ConversationLog: React.FC<ConversationLogProps> = ({
  messages,
}: ConversationLogProps) => {
  const userMessagesLength: number = messages.filter(
    (x) => x.role == "user"
  ).length;

  return (
    <details className="detail-container">
      <summary>Conversation Log ({userMessagesLength})</summary>
      {JSON.stringify(messages)}
    </details>
  );
};

export default ConversationLog;

import React from "react";

import { Message } from "../lib/openai-request";

const MessageDisplay: React.FC<Message> = ({ content, role }: Message) => {
  return (
    <div>
      <b>{role.toUpperCase()}</b>:<br></br>
      <pre>{content}</pre>
      <hr></hr>
    </div>
  );
};

export default MessageDisplay;

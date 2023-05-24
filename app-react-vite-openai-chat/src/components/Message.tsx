import React from "react";

interface MessageProps {
  role: string;
  content: string;
}

const Message: React.FC<MessageProps> = ({ content, role }) => {
  return (
    <div>
      <b>{role.toUpperCase()}</b>:<br></br>
      <pre>{content}</pre>
      <hr></hr>
    </div>
  );
};

export default Message;

import React from "react";

interface MessageProps {
  text: string;
  sender: string;
}

const Message: React.FC<MessageProps> = ({ text, sender }) => {
  return (
    <div>
      <p>
        {sender}: {text}
      </p>
      <hr></hr>
    </div>
  );
};

export default Message;

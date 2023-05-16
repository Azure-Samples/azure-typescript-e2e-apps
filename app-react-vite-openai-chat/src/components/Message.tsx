import React from 'react';

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
    </div>
  );
};

export default Message;
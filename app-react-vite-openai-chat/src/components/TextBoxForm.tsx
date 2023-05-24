import React, { useState } from "react";
import "../App.css";

interface TextBoxFormProps {
  onSubmit: (string) => void;
}

const TextBoxForm: React.FC<TextBoxFormProps> = ({ onSubmit }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    onSubmit(text.trim());
    setText("");
  };

  return (
    <form>
      <textarea
        className="chatbot-input"
        placeholder="Type your message..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
};

export default TextBoxForm;

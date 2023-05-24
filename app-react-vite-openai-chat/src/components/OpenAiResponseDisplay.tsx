import React from "react";
import { OpenAiResponse } from "../lib/openai-request";

type OpenAiResponseProps = {
  response: OpenAiResponse;
};

const OpenAiResponseDisplay: React.FC<OpenAiResponseProps> = ({
  response,
}: OpenAiResponseProps) => {
  return (
    <details className="detail-container">
      <summary>Last OpenAi Response</summary>
      {JSON.stringify(response)}
    </details>
  );
};

export default OpenAiResponseDisplay;

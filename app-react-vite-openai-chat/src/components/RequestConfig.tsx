import React, { useState } from "react";

export type OpenAiRequestConfig = {
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  stop: string[] | string | undefined;
};
interface SettingsFormProps {
  onSubmit: (OpenAiRequestConfig) => void;
}

export const defaultConfig: OpenAiRequestConfig = {
  max_tokens: 800,
  temperature: 0,
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: "",
};

const SettingsForm: React.FC<SettingsFormProps> = ({ onSubmit }) => {
  const [maxTokens, setMaxTokens] = useState(defaultConfig.max_tokens);
  const [temperature, setTemperature] = useState(defaultConfig.temperature);
  const [frequencyPenalty, setFrequencyPenalty] = useState(
    defaultConfig.frequency_penalty
  );
  const [presencePenalty, setPresencePenalty] = useState(
    defaultConfig.presence_penalty
  );
  const [topP, setTopP] = useState(defaultConfig.top_p);
  const [stop, setStop] = useState(defaultConfig.stop);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      max_tokens: maxTokens,
      temperature: temperature,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      top_p: topP,
      stop: stop !== "" ? stop : undefined,
    });
  };
  return (
    <details className="detail-container">
      <summary>Request settings</summary>
      <form onSubmit={handleSubmit}>
        <label>
          Max Tokens:
          <input
            type="number"
            value={maxTokens}
            onChange={(event) =>
              setMaxTokens(Number(event.target.value.trim()))
            }
          />
        </label>
        <br />
        <label>
          Temperature:
          <input
            type="number"
            value={temperature}
            onChange={(event) =>
              setTemperature(Number(event.target.value.trim()))
            }
          />
        </label>
        <br />
        <label>
          Frequency Penalty:
          <input
            type="number"
            value={frequencyPenalty}
            onChange={(event) =>
              setFrequencyPenalty(Number(event.target.value.trim()))
            }
          />
        </label>
        <br />
        <label>
          Presence Penalty:
          <input
            type="number"
            value={presencePenalty}
            onChange={(event) =>
              setPresencePenalty(Number(event.target.value.trim()))
            }
          />
        </label>
        <br />
        <label>
          Top P:
          <input
            type="number"
            value={topP}
            onChange={(event) => setTopP(Number(event.target.value.trim()))}
          />
        </label>
        <br />
        <label>
          Stop:
          <input
            type="text"
            value={stop}
            onChange={(event) => setStop(event.target.value.trim())}
          />
        </label>
        <br /> <button type="submit">Submit</button>
      </form>
    </details>
  );
};
export default SettingsForm;

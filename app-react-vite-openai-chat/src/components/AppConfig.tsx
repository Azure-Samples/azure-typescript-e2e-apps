import React, { useState } from "react";

export type OpenAiAppConfig = {
  apiVersion: string;
  endpoint: string;
  apiKey: string;
  deployment: string;
};
interface AppSettingsFormProps {
  onSubmit: (OpenAiAppConfig) => void;
}

export const defaultAppConfig: OpenAiAppConfig = {
  apiVersion: "2023-03-15-preview",
  endpoint: import.meta.env?.VITE_OPENAI_ENDPOINT as string,
  apiKey: import.meta.env?.VITE_OPENAI_API_KEY as string,
  deployment: import.meta.env?.VITE_OPENAI_DEPLOYMENT as string,
};

const AppSettingsForm: React.FC<AppSettingsFormProps> = ({ onSubmit }) => {
  const [apiVersion, setApiVersion] = useState(defaultAppConfig.apiVersion);
  const [endpoint, setEndpoint] = useState(defaultAppConfig.endpoint);
  const [apiKey, setApiKey] = useState(defaultAppConfig.apiKey);
  const [deployment, setDeployment] = useState(defaultAppConfig.deployment);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      apiVersion: apiVersion,
      endpoint: endpoint,
      apiKey: apiKey,
      deployment: deployment,
    });
  };
  return (
    <details className="detail-container">
      <summary>App settings</summary>
      <form onSubmit={handleSubmit}>
        <label>
          API Version:
          <input
            type="text"
            value={apiVersion}
            onChange={(event) => setApiVersion(event.target.value.trim())}
          />
        </label>
        <br />
        <label>
          Endpoint:
          <input
            type="text"
            value={endpoint}
            onChange={(event) => setEndpoint(event.target.value.trim())}
          />
        </label>
        <br />
        <label>
          API Key:
          <input
            type="text"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value.trim())}
          />
        </label>
        <br />
        <label>
          Deployment:
          <input
            type="text"
            value={deployment}
            onChange={(event) => setDeployment(event.target.value.trim())}
          />
        </label>
        <br /> <button type="submit">Submit</button>
      </form>
    </details>
  );
};
export default AppSettingsForm;

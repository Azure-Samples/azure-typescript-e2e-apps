export type OpenAiRequestConfig = {
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  stop: string[] | string | undefined;
};
export const defaultConfig: OpenAiRequestConfig = {
  max_tokens: 800,
  temperature: 0,
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: "",
};
export type OpenAiAppConfig = {
  apiVersion: string;
  endpoint: string;
  apiKey: string;
  deployment: string;
};
export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};
export type OpenAiConversation = {
  systemPrompt: Message;
  messages: Message[];
};
export type OpenAiRequest = {
  appConfig: OpenAiAppConfig;
  requestConfig: OpenAiRequestConfig;
  conversation: OpenAiConversation;
};
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;
export type JSONObject = { [key: string]: JSONValue };
export type JSONArray = JSONValue[];
export type JSONData = Record<string, JSONValue>;
export const OpenAiRequest = async (request: OpenAiRequest): Promise<any> => {
  if (
    request.appConfig.apiKey ||
    !request.appConfig.deployment ||
    !request.appConfig.endpoint ||
    !request.appConfig.apiVersion
  ) {
    return fetch(
      `${request.appConfig.endpoint}/openai/deployments/${request.appConfig.deployment}/chat/completions?api-version=${request.appConfig.apiVersion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": request.appConfig.apiKey,
        },
        body: JSON.stringify({
          messages: request.conversation.messages,
          config: request.requestConfig,
        }),
      }
    )
      .then((response) => response.json())
      .then((data: JSONData) => {
        return data;
      })
      .catch((error) => console.error(error));
  }
};

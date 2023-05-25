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
export type Role = "user" | "assistant" | "system";
export type Message = {
  role: Role | string;
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
export type Choice = {
  index: number;
  finish_reason: string;
  message: Message;
};
export type Usage = {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
};
export type OpenAiResponse = {
  id: string;

  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
};

export const OpenAiRequest = async (request: OpenAiRequest): Promise<any> => {
  console.log(request);
  if (
    !request.appConfig.apiKey ||
    !request.appConfig.deployment ||
    !request.appConfig.endpoint ||
    !request.appConfig.apiVersion
  ) {
    throw Error("Missing API Key or Deployment");
  }

  const response = await fetch(
    `${request.appConfig.endpoint}/openai/deployments/${request.appConfig.deployment}/chat/completions?api-version=${request.appConfig.apiVersion}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": request.appConfig.apiKey,
      },
      body: JSON.stringify({
        messages: request.conversation.messages,
        ...request.requestConfig,
      }),
    }
  );
  if (response.ok) {
    const data: unknown = response.json();
    return data as OpenAiResponse;
  }
};

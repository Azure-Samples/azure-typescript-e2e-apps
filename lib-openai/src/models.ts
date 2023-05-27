export type OpenAiError = {
  status: string;
  message: string;
  stack?: string;
};
export type OpenAiRequestConfig = {
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  stop: string[] | string;
};
export type OpenAiAppConfig = {
  apiVersion: string;
  endpoint: string;
  apiKey: string;
  deployment: string;
};

export type Role = 'user' | 'assistant' | 'system';
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

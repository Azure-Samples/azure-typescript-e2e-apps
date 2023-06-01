import {
  ChatCompletions,
  GetChatCompletionsOptions,
  ChatMessage
} from '@azure/openai';

export type OpenAiRequestConfig = GetChatCompletionsOptions;
export type OpenAiSuccessResponse = ChatCompletions;
export type Message = ChatMessage;

export type OpenAiAppConfig = {
  endpoint: string;
  apiKey: string;
  deployment: string;
};

export type Role = 'user' | 'assistant' | 'system';

export type OpenAiConversation = {
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
export type OpenAiErrorResponse = {
  message: string;
  stack?: string;
};

export type OpenAiResponse = {
  data?: OpenAiSuccessResponse;
  status: string;
  error?: OpenAiErrorResponse;
};

export type DebugOptions = {
  debug: boolean;
  logger: (message: string) => void;
};

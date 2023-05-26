export type OpenAiRequestConfig = {
  max_tokens: number;
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  stop: string[] | string;
};
export const defaultConfig: OpenAiRequestConfig = {
  max_tokens: 800,
  temperature: 0,
  top_p: 0.95,
  frequency_penalty: 0,
  presence_penalty: 0,
  stop: ''
};
export type OpenAiAppConfig = {
  apiVersion: string;
  endpoint: string;
  apiKey: string;
  deployment: string;
};

export type ConversationConfig = {
  systemContent: string;
  assistantContent: string;
};
export const defaultConversationConfig: ConversationConfig = {
  systemContent:
    'Your are an Azure services expert whose primary purpose is to help customers understand how to use Azure with JavaScript and the Azure SDKs in the @azure namespace of npm package manager.',
  assistantContent:
    'I am an Azure JavaScript and TypeScript developer expert. I can help you use the Azure SDKs for JavaScript.'
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

export class OpenAIConversationManager {
  #conversationConfig: OpenAiConversation;
  #appConfig: OpenAiAppConfig;
  #requestConfig: OpenAiRequestConfig;
  #messages: Message[] = [];

  constructor(
    endpoint: string = process.env.AZURE_OPENAI_ENDPOINT as string,
    apiKey: string = process.env.AZURE_OPENAI_API_KEY as string,
    deployment: string = process.env.AZURE_OPENAI_DEPLOYMENT as string,
    apiVersion = '2023-03-15-preview',
    systemContent: string
  ) {
    this.#appConfig = {
      endpoint,
      apiKey,
      deployment,
      apiVersion
    };

    this.#requestConfig = defaultConfig;

    if (systemContent && systemContent.length > 0) {
      this.#conversationConfig = {
        systemPrompt: {
          role: 'system',
          content: systemContent
        },
        messages: []
      };
    } else {
      this.#conversationConfig = {
        systemPrompt: {
          role: 'system',
          content: defaultConversationConfig.systemContent
        },
        messages: []
      };
    }
  }
  async OpenAiConverationStep(userText: string): Promise<any> {
    const request: OpenAiRequest = {
      conversation: {
        systemPrompt: {
          role: 'system',
          content: defaultConversationConfig.systemContent
        },
        messages: [
          ...this.#messages,
          {
            role: 'user',
            content: userText
          }
        ]
      },
      appConfig: this.#appConfig,
      requestConfig: this.#requestConfig
    };
    return await this.OpenAiRequest(request);
  }
  async OpenAiRequest(request: OpenAiRequest): Promise<any> {
    if (
      !request.appConfig.apiKey ||
      !request.appConfig.deployment ||
      !request.appConfig.endpoint ||
      !request.appConfig.apiVersion
    ) {
      throw Error('Missing API Key or Deployment');
    }

    const response = await fetch(
      `${request.appConfig.endpoint}/openai/deployments/${request.appConfig.deployment}/chat/completions?api-version=${request.appConfig.apiVersion}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': request.appConfig.apiKey
        },
        body: JSON.stringify({
          messages: request.conversation.messages,
          ...request.requestConfig
        })
      }
    );
    if (response.ok) {
      const data: unknown = response.json();
      return data as OpenAiResponse;
    }
  }
}

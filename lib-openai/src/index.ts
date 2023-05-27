import {
  OpenAiAppConfig,
  OpenAiConversation,
  OpenAiError,
  OpenAiRequest,
  OpenAiRequestConfig,
  OpenAiResponse
} from './models';

// export types a client needs
export {
  OpenAiAppConfig,
  OpenAiError,
  OpenAiRequest,
  OpenAiRequestConfig,
  OpenAiResponse
} from './models';

export default class OpenAIConversationManager {
  #appConfig: OpenAiAppConfig;
  #conversationConfig: OpenAiConversation;
  #requestConfig: OpenAiRequestConfig = {
    max_tokens: 800,
    temperature: 0,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ''
  };

  constructor(
    endpoint: string = process.env.AZURE_OPENAI_ENDPOINT as string,
    apiKey: string = process.env.AZURE_OPENAI_API_KEY as string,
    deployment: string = process.env.AZURE_OPENAI_DEPLOYMENT as string,
    apiVersion = '2023-03-15-preview',
    systemContent = 'Your are an Azure services expert whose primary purpose is to help customers understand how to use Azure with the JavaScript SDKs.'
  ) {
    this.#appConfig = {
      endpoint,
      apiKey,
      deployment,
      apiVersion
    };

    this.#conversationConfig = {
      systemPrompt: {
        role: 'system',
        content: systemContent
      },
      messages: []
    };
  }

  async OpenAiConverationStep(
    userText: string,
    appOptions: OpenAiAppConfig,
    requestOptions: OpenAiRequestConfig
  ): Promise<OpenAiResponse | OpenAiError> {
    try {
      const request: OpenAiRequest = {
        conversation: {
          // add the system prompt to focus the conversation
          systemPrompt: this.#conversationConfig.systemPrompt,
          messages: [
            // add all previous messages so the conversation
            // has context
            ...this.#conversationConfig.messages,
            // add the latest user message
            {
              role: 'user',
              content: userText
            }
          ]
        },
        appConfig: appOptions ? appOptions : this.#appConfig,
        requestConfig: requestOptions ? requestOptions : this.#requestConfig
      };
      return await this.OpenAiRequest(request);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          status: 'error',
          message: error.message,
          stack: error.stack
        };
      } else {
        return {
          status: 'error',
          message: 'Unknown error',
          stack: ''
        };
      }
    }
  }
  async OpenAiRequest(
    request: OpenAiRequest
  ): Promise<OpenAiResponse | OpenAiError> {
    if (
      !request.appConfig.apiKey ||
      !request.appConfig.deployment ||
      !request.appConfig.endpoint ||
      !request.appConfig.apiVersion
    ) {
      return {
        status: 'error',
        message: 'OpenAiRequest: Missing API Key or Deployment'
      };
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
    } else {
      return { status: 'error', message: response.statusText };
    }
  }
}

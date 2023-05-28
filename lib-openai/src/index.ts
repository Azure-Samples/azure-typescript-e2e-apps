import {
  OpenAiAppConfig,
  OpenAiConversation,
  OpenAiRequest,
  OpenAiRequestConfig,
  OpenAiResponse,
  OpenAiSuccessResponse
} from './models';

// export types a client needs
export {
  OpenAiAppConfig,
  OpenAiRequest,
  OpenAiRequestConfig,
  OpenAiResponse,
  OpenAiSuccessResponse
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
    appOptions?: OpenAiAppConfig,
    requestOptions?: OpenAiRequestConfig
  ): Promise<OpenAiResponse> {
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

      const response = await this.OpenAiRequest(request);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          status: '499',
          error: {
            message: error.message,
            stack: error.stack
          },
          data: undefined
        };
      } else {
        return {
          status: '498',
          error: {
            message: JSON.stringify(error)
          },
          data: undefined
        };
      }
    }
  }
  async OpenAiRequest(request: OpenAiRequest): Promise<OpenAiResponse> {
    if (
      !request.appConfig.apiKey ||
      !request.appConfig.deployment ||
      !request.appConfig.endpoint ||
      !request.appConfig.apiVersion
    ) {
      return {
        data: undefined,
        status: '400',
        error: {
          message: 'OpenAiRequest: Missing API Key or Deployment'
        }
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
      const data: OpenAiSuccessResponse = await response.json();
      return {
        data,
        status: '200',
        error: undefined
      };
    } else {
      return {
        status: '497',
        error: {
          message: response.statusText
        }
      };
    }
  }
}

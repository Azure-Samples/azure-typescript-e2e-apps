import {
  OpenAIClient,
  AzureKeyCredential,
  GetChatCompletionsOptions
} from '@azure/openai';
import { DefaultAzureCredential } from '@azure/identity';

import {
  DebugOptions,
  OpenAiAppConfig,
  OpenAiConversation,
  OpenAiRequest,
  OpenAiRequestConfig,
  OpenAiResponse,
  OpenAiSuccessResponse
} from './models';
import { ChatCompletions } from '@azure/openai';

// export types a client needs
export {
  DebugOptions,
  OpenAiAppConfig,
  OpenAiRequest,
  OpenAiRequestConfig,
  OpenAiResponse,
  OpenAiSuccessResponse
} from './models';

export default class OpenAIConversationClient {
  #appConfig: OpenAiAppConfig;
  #conversationConfig: OpenAiConversation;
  #requestConfig: GetChatCompletionsOptions = {
    maxTokens: 800,
    temperature: 0.9,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  };

  #openAiClient: OpenAIClient;

  constructor(
    endpoint: string = process.env.AZURE_OPENAI_ENDPOINT as string,
    apiKey: string = process.env.AZURE_OPENAI_API_KEY as string,
    deployment: string = process.env.AZURE_OPENAI_DEPLOYMENT as string
  ) {
    this.#appConfig = {
      endpoint,
      apiKey,
      deployment
    };

    this.#conversationConfig = {
      messages: []
    };

    if (apiKey && endpoint) {
      this.#openAiClient = new OpenAIClient(
        endpoint,
        new AzureKeyCredential(apiKey)
      );
    } else {
      this.#openAiClient = new OpenAIClient(
        endpoint,
        new DefaultAzureCredential()
      );
    }
  }

  async OpenAiConverationStep(
    userText: string,
    appOptions?: OpenAiAppConfig | undefined,
    requestOptions?: OpenAiRequestConfig | undefined,
    debugOptions?: DebugOptions | undefined
  ): Promise<OpenAiResponse> {
    try {
      // REQUEST
      const request: OpenAiRequest = {
        conversation: {
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
      if (debugOptions?.debug) {
        debugOptions.logger(`LIB OpenAi request: ${JSON.stringify(request)}`);
      }

      // RESPONSE
      const response = await this.OpenAiRequest(request);
      if (debugOptions?.debug) {
        debugOptions.logger(`LIB OpenAi response: ${JSON.stringify(response)}`);
      }
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
      !request.appConfig.endpoint
    ) {
      return {
        data: undefined,
        status: '400',
        error: {
          message: 'OpenAiRequest: Missing API Key or Deployment'
        }
      };
    }

    const chatCompletions: ChatCompletions =
      await this.#openAiClient.getChatCompletions(
        request.appConfig.deployment,
        request.conversation.messages,
        request.requestConfig
      );

    return {
      data: chatCompletions,
      status: '200',
      error: undefined
    };
  }
}

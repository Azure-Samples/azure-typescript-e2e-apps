import { StartupData } from './../startup/startup';

import OpenAIConversationClient, { OpenAiAppConfig, OpenAiRequestConfig, DebugOptions, OpenAiResponse } from '../openai-chat'

// new class called game which turns a new instance as the default
class Game {

    constructor() {
    }
  
    public async getGame(gameContext, StartupData, log){

        const openAiConversationClient = new OpenAIConversationClient(
            {
                endpoint: StartupData.azureOpenAiEndpoint,
                apiKey: StartupData.azureOpenAiApiKey,
                deployment: StartupData.azureOpenAiDeployment,
                systemPrompt: StartupData.azureOpenAiDeploymentSystemPrompt
            }
        );
        const requestOptions: OpenAiRequestConfig = {
            maxTokens: 2000,
            temperature: 0.9,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0
        };
        const debugOptions: DebugOptions = {
            debug: true,
            logger: log
        };
        const appOptions: OpenAiAppConfig = {
            endpoint: StartupData.azureOpenAiEndpoint,
            apiKey: StartupData.azureOpenAiApiKey,
            deployment: StartupData.azureOpenAiDeployment
        };

        return await openAiConversationClient.OpenAiConverationStep(
            gameContext.userText,
            appOptions,
          requestOptions,
          debugOptions
        );

    }
}

export default new Game();


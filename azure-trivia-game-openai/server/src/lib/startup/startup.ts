
export type StartupData = {
    azureMapsApiKey: string;
    azureMapsBaseUrl: string;
    azureOpenAiEndpoint: string;
    azureOpenAiApiKey: string;
    azureOpenAiDeployment: string;
    azureOpenAiDeploymentSystemPrompt: string;
}
export type StartupResponse = {
    status: number;
    errors: string[];
    data: StartupData;
}

// Singleton class
class SingletonClass {
    private static instance: SingletonClass;
    private data: StartupData = {
        azureMapsApiKey: process.env.AZURE_MAPS_API_KEY,
        azureMapsBaseUrl: process.env.AZURE_MAPS_ENDPOINT,
        azureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
        azureOpenAiApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAiDeployment: process.env.AZURE_OPENAI_DEPLOYMENT,
        azureOpenAiDeploymentSystemPrompt: process.env.AZURE_OPENAI_DEPLOYMENT_SYSTEM_PROMPT
    };

    private constructor() {
        // Private constructor to prevent instantiation outside of the class  
    }
    private verifyEnvVars(): string[] {
        const missingEnvVars: string[] = [];

        if (!this.data.azureMapsApiKey) missingEnvVars.push("AZURE_MAPS_API_KEY");
        if (!this.data.azureMapsApiKey) missingEnvVars.push("AZURE_MAPS_API_KEY");
        if (!this.data.azureOpenAiEndpoint) missingEnvVars.push("AZURE_OPENAI_ENDPOINT");
        if (!this.data.azureOpenAiApiKey) missingEnvVars.push("AZURE_OPENAI_API_KEY");
        if (!this.data.azureOpenAiDeployment) missingEnvVars.push("AZURE_OPENAI_DEPLOYMENT");
        if (!this.data.azureOpenAiDeploymentSystemPrompt) missingEnvVars.push("AZURE_OPENAI_DEPLOYMENT_SYSTEM_PROMPT");

        return missingEnvVars;
    }

    public static getInstance(): SingletonClass {
        if (!SingletonClass.instance) {
            SingletonClass.instance = new SingletonClass();
        }
        return SingletonClass.instance;
    }

    public setData(newData: StartupData): void {
        this.data = newData;
    }

    public getData(): StartupResponse {

        const missingEnvVars = this.verifyEnvVars();

        if (missingEnvVars.length > 0) return { status: 500, errors: missingEnvVars, data: null }

        return { status: 200, errors: null, data: this.data };
    }
}

const singletonInstance = SingletonClass.getInstance();
export default singletonInstance;

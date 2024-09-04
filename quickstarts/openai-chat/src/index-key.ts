import { AzureOpenAI } from "openai";
import { type ChatCompletion, type ChatCompletionCreateParamsNonStreaming } from "openai/resources/index";
import "dotenv/config";

// You will need to set these environment variables or edit the following values
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "<endpoint>";
const apiKey = process.env["AZURE_OPENAI_API_KEY"] || "<api key>";

const apiVersion = "2024-05-01-preview";
const deployment = "gpt-4o"; //This must match your deployment name.

function getClient(): AzureOpenAI {
    return new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
}

function createMessages(): ChatCompletionCreateParamsNonStreaming {
    return {
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "Does Azure OpenAI support customer managed keys?" },
            { role: "assistant", content: "Yes, customer managed keys are supported by Azure OpenAI?" },
            { role: "user", content: "Do other Azure AI services support this too?" },
        ],
        model: ""
    }
}
async function getChoices(completion: ChatCompletion): Promise<void> {
    for (const choice of completion.choices) {
        console.log(choice.message);
    }
}
export async function main() {

    const client = getClient();
    const messages = createMessages();
    const result = await client.chat.completions.create(messages);
    await getChoices(result);
}

main().catch((err) => {
    console.error("The sample encountered an error:", err);
});
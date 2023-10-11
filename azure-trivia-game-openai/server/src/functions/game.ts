import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import game from '../lib/game/game';
import startupInstance, { StartupData, StartupResponse} from "../lib/startup/startup";

type QuestionPostBody = {
    userText: string;
};

const startupResponse = startupInstance.getData();

export async function question(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    if(startupResponse.status !== 200) return {
        status: startupResponse.status,
        jsonBody: { error: startupResponse.errors }
    }

    const body = await request.json();
    const { userText } = body as QuestionPostBody;

    const { status, data, error } = await game.getGame({ userText }, startupResponse.data, context.log);

    if (status === 'error') {
        return {
            status: 500,
            jsonBody: error
        };
    } else {
        const game = JSON.parse(data?.choices?.[0]?.message?.content);
        return { jsonBody: game };
    }
};

app.http('game', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: question
});

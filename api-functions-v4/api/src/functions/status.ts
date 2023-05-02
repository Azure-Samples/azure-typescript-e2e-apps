import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { name, version } from '../../package.json';

export async function status(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return {
        status: 200,
        jsonBody: {
            name,
            version,
            env: process.env,
            requestHeaders: request.headers
        }
    };
};

app.http('status', {
    route: "status",
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: status
});

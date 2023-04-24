import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function status(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return { jsonBody: {
        env: process.env,
        requestHeaders: request.headers 
    }};
};

app.http('status', {
    route: "status",
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: status
});

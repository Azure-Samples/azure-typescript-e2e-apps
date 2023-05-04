import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { name, version } from '../../package.json';
function isObject(v) {
    return '[object Object]' === Object.prototype.toString.call(v);
};
function sortJson(o){
    if (Array.isArray(o)) {
        return o.sort().map(sortJson);
    } else if (isObject(o)) {
        return Object
            .keys(o)
        .sort()
            .reduce(function(a, k) {
                a[k] = sortJson(o[k]);

                return a;
            }, {});
    }
    return o;
}

export async function status(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const sortedEnv = sortJson(process.env);

    return { jsonBody: {
        name,
        version,
        env: sortedEnv,
        requestHeaders: request.headers 
    }};
};

app.http('status', {
    route: "status",
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: status
});
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

function isObject<T>(v: T): boolean {
    return '[object Object]' === Object.prototype.toString.call(v);
  }
function sortJson<T extends Record<string, any>>(o: T): T {
    if (Array.isArray(o)) {
      return o.sort().map(sortJson) as unknown as T;
    } else if (isObject(o)) {
      return Object.keys(o)
        .sort()
        .reduce(function (a: Record<keyof T, any>, k) {
          a[k as keyof T] = sortJson(o[k as keyof T]);
          return a;
        }, {} as T);
    }
    return o;
  }

export async function status(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return {
        status: 200,
        jsonBody: {
            env: sortJson(process.env)
        }
    };
};

app.http('status', {
    route: "status",
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: status
});

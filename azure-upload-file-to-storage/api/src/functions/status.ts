import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app
} from '@azure/functions';

export async function status(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const responseBody = {
    status: 'ok',
    request: {
      method: request.method,
      url: request.url,
      headers: request.headers
    },
    context: {
      invocationId: context.invocationId
      // Other context properties can be added here if needed
    }
  };

  return { jsonBody: responseBody };
}

app.get('status', {
  authLevel: 'anonymous',
  handler: status
});

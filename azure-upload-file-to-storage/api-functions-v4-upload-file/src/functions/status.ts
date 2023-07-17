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
  return {
    jsonBody: { status: 'status ok' }
  };
}

app.get('status', {
  authLevel: 'anonymous',
  handler: status
});

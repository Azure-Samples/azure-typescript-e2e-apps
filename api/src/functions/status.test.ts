import { HttpRequest } from '@azure/functions';
import { status } from './status';
import { InvocationContext, InvocationContextInit, HttpRequestInit } from '@azure/functions';

import * as dotenv from 'dotenv'
dotenv.config();

describe('Test endpoint', () => {

  const originalEnv = process.env;
  const MOCKED_NODE_ENV = 'jest-mock-node-env';

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NODE_ENV: MOCKED_NODE_ENV,
    };
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return 200 with mocked environment variable', async () => {

    const contextInit: InvocationContextInit ={
        invocationId: '1',
        functionName: 'status',
        logHandler: jest.fn(),
        traceContext: {},
        retryContext: {
            retryCount: 0,
            maxRetryCount: 0,
            exception: undefined
        },
        triggerMetadata: {}

    };
    const httpRequestInit: HttpRequestInit = {
      method: "GET",
      url: "http://localhost:7071/status",
      body: undefined,
      headers: {},
      query: {},
      params: {}    
    };
    const context: InvocationContext = new InvocationContext(contextInit);
    const request: HttpRequest = new HttpRequest(httpRequestInit);
    const response = await status(request, context);

    expect(response.status).toBe(200);
    expect(response.jsonBody.env).toHaveProperty('NODE_ENV', MOCKED_NODE_ENV);
  });
});
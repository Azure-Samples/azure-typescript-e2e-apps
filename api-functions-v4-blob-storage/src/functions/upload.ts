import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import HTTP_CODES from "http-status-enum";

// Multiform management
import * as multipart from "parse-multipart";

// Used to get read-only SAS token to return with URL
import { generateReadOnlySASUrl } from '@azure-typescript-e2e-apps/lib-azure-sql';

type CheckRequiredParamsResult = { success: boolean, errors?: string[], body?: Record<string, any> };

async function checkRequiredParams(request: HttpRequest):Promise<CheckRequiredParamsResult>{

  let errors = [];

  // get connection string to Azure Storage from environment variables
  // Replace with DefaultAzureCredential before moving to production
  const storageConnectionString = process.env.AzureWebJobsStorage;
  if (!storageConnectionString) {
    errors.push(`AzureWebJobsStorage env var is not defined - get Storage Connection string from Azure portal`);
  }

  // User name is the container name
  const containerName = request.query?.username;
  if (!containerName) {
    errors.push(`username is not defined`);
  }

  // `filename` is required property to use multi-part npm package
  const fileName = request.query?.filename;
  if (!fileName) {
    errors.push(`filename is not defined`);
  }

  // file content must be passed in as body
  const body = await request.json();
  if (!body || !body.length) {
    errors.push(`Request body is not defined`);
  }

  // Content type is required to know how to parse multi-part form
  if (!request.headers || !request.headers["content-type"]) {
    errors.push(`Content type is not sent in header 'content-type'`);
  }
  return { errors, body, success: errors.length === 0 };
}

export async function postUpload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

  try {

    context.log(`Http function processed request for url "${request.url}"`);

    // return errors if any
    const result: CheckRequiredParamsResult = await checkRequiredParams(request);
    if (!result.success) {
      return {
        status: HTTP_CODES.BAD_REQUEST,
        body: result.errors
      }
    }

    const userName = request.query?.username;
    const fileName = request.query?.filename;
    const containerName = userName;

    console.log(`*** Username:${request.query?.username}, Filename:${request.query?.filename}, Content type:${request.headers["content-type"]}, Length:${body.length}`);

    // Each chunk of the file is delimited by a special string
    const bodyBuffer = Buffer.from(result?.body as any);
    const boundary = multipart.getBoundary(request.headers["content-type"]);
    const parts = multipart.Parse(bodyBuffer, boundary);

    return {
      status: 200,

    };
  } catch (err) {

    console.log(err)
    return {
      status: 500,
      body: {
        err
      }
    }
  }
};

app.http('upload', {
  route: "upload",
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: postUpload
});

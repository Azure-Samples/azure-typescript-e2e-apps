import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import HTTP_CODES from "http-status-enum";

// Multiform management
import * as multipart from "parse-multipart";

//type CheckRequiredParamsResult = { success: boolean, errors?: string[], body?: Record<string, any> };

// Used to get read-only SAS token URL
import { generateReadOnlySASUrl } from './azure-storage-blob-sas-url';

function returnResult({
  status = 500,
  body = {}
}): HttpResponseInit {
  return {
    status,
    jsonBody: body
  }
}

export async function postUpload(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

  try {

    context.log('upload HTTP trigger function processed a request.');

    // get connection string to Azure Storage from environment variables
    // Replace with DefaultAzureCredential before moving to production
    const storageConnectionString = process.env.AzureWebJobsStorage;
    if (!storageConnectionString) {
      returnResult({ status: HTTP_CODES.BAD_REQUEST, body: { error: `AzureWebJobsStorage env var is not defined - get Storage Connection string from Azure portal` } })
    }

    // User name is the container name
    const containerName = request.query.get('username');
    if (!containerName) {
      returnResult({ status: HTTP_CODES.BAD_REQUEST, body: { error: `username is not defined` } })

    }

    // `filename` is required property to use multi-part npm package
    const fileName = request.query.get('filename');
    if (!fileName) {
      returnResult({ status: HTTP_CODES.BAD_REQUEST, body: { error: `filename is not defined` } })

    }

    // file content must be passed in as body
    const body = await request.formData();
    if (body) {
      returnResult({ status: HTTP_CODES.BAD_REQUEST, body: { error: `Request body is not defined` } })
    }

    // Content type is required to know how to parse multi-part form
    const contentType = request.headers.get("content-type");
    if (!contentType) {
      returnResult({ status: HTTP_CODES.BAD_REQUEST, body: { error: `Content type is not sent in header 'content-type'` } });
    }


    context.log(`*** Username:${containerName}, Filename:${fileName}, Content type:${contentType}, Length:${body}`);

    return returnResult({ status: HTTP_CODES.OK, body: { message: `Upload successful` } });

  } catch (err) {

    console.log(err)
  }
};

app.http('upload', {
  route: "upload",
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: postUpload
});

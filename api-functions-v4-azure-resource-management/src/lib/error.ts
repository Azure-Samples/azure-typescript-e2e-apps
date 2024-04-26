export function processError(err: unknown): any {
  if (typeof err === 'string') {
    return { body: err.toUpperCase(), status: 500 };
  } else if (
    err['stack'] &&
    process.env.NODE_ENV.toLowerCase() !== 'production'
  ) {
    return { jsonBody: { stack: err['stack'], message: err['message'] } };
  } else if (err instanceof Error) {
    return { body: err.message, status: 500 };
  } else {
    return { body: JSON.stringify(err) };
  }
}

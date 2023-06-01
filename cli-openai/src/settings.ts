// CLI Loop
export const checkRequiredEnvParams = (
  env: Record<string, string | undefined>
): string[] => {
  const errors = [];

  if (!env) {
    errors.push("Can't read environment variables.");
  }
  if (!env?.AZURE_OPENAI_ENDPOINT) {
    errors.push('AZURE_OPENAI_ENDPOINT environment variable not found');
  }
  if (!env?.AZURE_OPENAI_API_KEY) {
    errors.push('AZURE_OPENAI_API_KEY environment variable not found');
  }
  if (!env?.AZURE_OPENAI_DEPLOYMENT) {
    errors.push('AZURE_OPENAI_DEPLOYMENT environment variable not found');
  }
  return errors;
};

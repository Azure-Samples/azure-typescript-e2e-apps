# Azure CLI: Create an OpenAI resource
# https://learn.microsoft.com/en-us/cli/azure/cognitiveservices/account#az-cognitiveservices-account-create

# Exit if user isn't signed on and remind them to use az login
if ! az account show 2>/dev/null; then
  echo "Please sign in using 'az login --use-device-code' before running this script."
  exit 1
fi

SUBSCRIPTION="b57b253a-e19e-4a9c-a0c0-a5062910a749"
RANDOM_SUFFIX=$(openssl rand -hex 5)
RESOURCE_GROUP="my-resource-group-$RANDOM_SUFFIX"
DEPLOYMENT_NAME="my-deployment-$RANDOM_SUFFIX"
LOCATION="swedencentral"
RESOURCE_NAME="my-openai-resource-$RANDOM_SUFFIX"
SKU="S0"


# Create resource group if it doesn't exist
az group create \
--subscription "$SUBSCRIPTION" \
--name "$RESOURCE_GROUP" \
--location "$LOCATION" 

echo "Resource group $RESOURCE_GROUP created."

# Create an OpenAI resource
RESULT=$(az cognitiveservices account create \
--kind OpenAI \
--subscription "$SUBSCRIPTION" \
--resource-group "$RESOURCE_GROUP" \
--location "$LOCATION" \
--name "$RESOURCE_NAME" \
--sku "$SKU")

echo "OpenAI resource $RESOURCE_NAME created."

# Output RESULT into a file
echo $RESULT > result.json

# Get the keys for the OpenAI resource
KEYS=$(az cognitiveservices account keys list \
--subscription $SUBSCRIPTION \
--resource-group $RESOURCE_GROUP \
--name $RESOURCE_NAME)

echo "Keys for $RESOURCE_NAME retrieved."

# Convert the JSON keys to environment variables
KEY1=$(echo $KEYS | jq -r '.key1')

echo "Key1: $KEY1"

# Write the keys to the .env file
echo "AZURE_OPENAI_KEY=$KEY1" > .env
echo "AZURE_OPENAI_RESOURCE=$RESOURCE_NAME" >> .env

# Parse the JSON file and extract the endpoints array
ENDPOINTS=$(echo $RESULT | jq -r '.properties.endpoints | with_entries(.key |= gsub(" "; "_"))')

echo "Endpoints: $ENDPOINTS"

# Loop over the keys and values in the endpoints object
# for key in $(echo $ENDPOINTS | jq -r 'keys[]'); do
#   # Extract the value for this key
#   value=$(echo $ENDPOINTS | jq -r --arg key "$key" '.[$key]')

#   # Write the key and value to the .env file
#   echo "${key}=${value}" >> .env
# done

# Loop over the keys and values in the endpoints object
for key in $(echo $ENDPOINTS | jq -r 'keys[]'); do
  # Extract the value for this key
  value=$(echo $ENDPOINTS | jq -r --arg key "$key" '.[$key]')

  # Convert the key to uppercase
  key_uppercase=$(echo $key | tr '[:lower:]' '[:upper:]')

  key_endpoint=$(echo $key_uppercase | sed 's/API/ENDPOINT/g')

  # Write the uppercase key and value to the .env file
  echo "${key_endpoint}=${value}" >> .env
done

# DON"T NEED DEPLOYMENT TO USE OPENAI ASSISTANTS
# Create deployment
# az cognitiveservices account deployment create \
# --model-format OpenAI \
# --model-name gpt-4 \
# --model-version 1106-preview \
# --name $RESOURCE_NAME \
# --resource-group $RESOURCE_GROUP \
# --deployment-name $DEPLOYMENT_NAME
#!/bin/bash
# 
# Create a .env with the following params
# AZURE_OPENAI_ENDPOINT
# AZURE_OPENAI_API_KEY
# AZURE_OPENAI_DEPLOYMENT_NAME

# Load environment variables from .env file
# Removes trailing whitespace
export $(grep -v '^#' .env | sed 's/[[:space:]]*$//' | xargs)

# Set the REST API version
AZURE_API_VERSION=2024-08-01-preview

ASSISTANT_RESPONSE=$(curl $AZURE_OPENAI_ENDPOINT/openai/assistants?api-version=$AZURE_API_VERSION \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instructions": "You are an AI assistant that can write code to help answer math questions.",
    "name": "Math Assist",
    "tools": [{"type": "code_interpreter"}],
    "model": "'$AZURE_OPENAI_DEPLOYMENT_NAME'"
  }')
ASSISTANT_ID=$(echo $ASSISTANT_RESPONSE | jq --raw-output '.id')
echo 'ASSISTANT_ID ' $ASSISTANT_ID

# Create a thread
THREAD_RESPONSE=$(curl $AZURE_OPENAI_ENDPOINT/openai/threads?api-version=$AZURE_API_VERSION \
  -H "Content-Type: application/json" \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -d '')
THREAD_ID=$(echo $THREAD_RESPONSE | jq --raw-output '.id')
echo 'THREAD_ID ' $THREAD_ID

# Add a user question to the thread
MESSAGE_RESPONSE=$(curl $AZURE_OPENAI_ENDPOINT/openai/threads/$THREAD_ID/messages?api-version=$AZURE_API_VERSION \
-H "Content-Type: application/json" \
-H "api-key: $AZURE_OPENAI_API_KEY" \
-d '{
    "role": "user",
    "content": "I need to solve the equation `3x + 11 = 14`. Can you help me?"
   }')
MESSAGE_ID=$(echo $MESSAGE_RESPONSE | jq --raw-output '.id')
echo 'MESSAGE_ID ' $MESSAGE_ID

# Run the thread
RUN_THREAD_RESPONSE=$(curl $AZURE_OPENAI_ENDPOINT/openai/threads/$THREAD_ID/runs?api-version=$AZURE_API_VERSION \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "assistant_id": "'$ASSISTANT_ID'"
  }')
RUN_ID=$(echo $RUN_THREAD_RESPONSE | jq --raw-output '.id')
echo 'RUN_ID ' $RUN_ID

# Retrieve the status of the run - continue until status is completed
# RUN_STATUS_RESULT=$(curl $AZURE_OPENAI_ENDPOINT/openai/threads/$THREAD_ID/runs/$RUN_ID?api-version=$AZURE_API_VERSION \
#   -H "api-key: $AZURE_OPENAI_API_KEY")
# RUN_STATUS=$(echo $RUN_STATUS_RESULT | jq --raw-output '.status')
# echo 'RUN_STATUS ' $RUN_STATUS

while true; do
  # Make the curl request and capture the response
  RUN_STATUS_RESULT=$(curl -s "$AZURE_OPENAI_ENDPOINT/openai/threads/$THREAD_ID/runs/$RUN_ID?api-version=$AZURE_API_VERSION" \
    -H "api-key: $AZURE_OPENAI_API_KEY")
  
  # Extract the status from the JSON response
  RUN_STATUS=$(echo $RUN_STATUS_RESULT | jq --raw-output '.status')
  
  # Print the current status
  echo "RUN_STATUS: $RUN_STATUS"
  
  # Check if the status is 'completed'
  if [ "$RUN_STATUS" == "completed" ]; then
    break
  fi
  
  # Wait for a few seconds before the next iteration
  sleep 5
done

# # Assistant response
ASSISTANT_ANSWER=$(curl $AZURE_OPENAI_ENDPOINT/openai/threads/$THREAD_ID/messages?api-version=$AZURE_API_VERSION \
  -H "Content-Type: application/json" \
  -H "api-key: $AZURE_OPENAI_API_KEY")
# echo 'ASSISTANT_ANSWER ' $ASSISTANT_ANSWER
echo $ASSISTANT_ANSWER | jq -r '.data[] | .content[0].text.value'
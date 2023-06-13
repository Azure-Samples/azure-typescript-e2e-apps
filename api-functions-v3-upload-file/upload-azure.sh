#!/bin/bash
FUNCTION_URL="https://YOUR-RESOURCE-NAME.azurewebsites.net/api/upload?code=YOUR-FUNCTION-KEY"

echo "${FUNCTION_URL}"

curl -X POST \
-F "filename=@test-file.txt" \
-H "Content-Type: text/plain" \
"$FUNCTION_URL&filename=test-file.txt&username=jsmith" --verbose

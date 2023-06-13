#!/bin/bash
curl -X POST \
-F 'filename=@test-file.txt' \
-H 'Content-Type: text/plain' \
'http://localhost:7071/api/upload?filename=test-file.txt&username=jsmith' --verbose

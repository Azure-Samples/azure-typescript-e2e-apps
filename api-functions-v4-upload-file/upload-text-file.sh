#!/bin/bash

curl --location 'http://localhost:7071/api/upload-text-file' -F "filename=@test-file.txt" --form 'name="tom"' --verbose

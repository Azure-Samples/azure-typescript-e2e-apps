#!/bin/bash

curl --location 'http://localhost:7071/api/upload-text-file' -F "filename=@test-file.txt" -F "celebrities=@celebrities.jpg" --form 'name="tom"' --verbose

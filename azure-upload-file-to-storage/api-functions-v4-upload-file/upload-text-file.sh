#!/bin/bash

curl --location 'http://localhost:7071/api/upload' -F "file=@test-file.txt" --form 'name="tom"' --verbose

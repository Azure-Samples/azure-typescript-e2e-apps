#!/bin/bash

curl --location 'http://localhost:7071/api/status' --form 'name="tom"' --verbose

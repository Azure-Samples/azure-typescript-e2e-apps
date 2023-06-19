#!/bin/bash

myrand=$((1 + RANDOM % 100000))

# username becomes the container name
# filename becomes the back half of the file name. A random guid is prepended. 
# file can be either of the following or bring your own:
#    celebrities.jpg
#    test-file.txt

curl --location "http://localhost:7071/api/upload?username=johnny&filename=$myrand-helloworld.jpg" --form "file=@celebrities.jpg" --verbose
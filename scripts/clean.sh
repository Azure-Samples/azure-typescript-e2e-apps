#!/bin/bash

# Remove temp files from TS directories

folders=("api" "api-expressjs-openapi-azuresql" "api-expressjs-openapi-inmemory")

for folder in "${folders[@]}"
do
    cd "$folder"

    if [ -d "node_modules" ]
    then
    # Delete node_modules folder
    rm -rf node_modules
    echo "node_modules folder deleted from $folder"
    fi

    if [ -d "dist" ]
    then
    # Delete node_modules folder
    rm -rf node_modules
    echo "node_modules folder deleted from $folder"
    fi


    if [ -f "package-lock.json" ]
    then
    # Delete package-lock.json file
    rm -f package-lock.json
    echo "package-lock.json file deleted from $folder"
    fi

    cd ..
done

echo "Script execution complete."
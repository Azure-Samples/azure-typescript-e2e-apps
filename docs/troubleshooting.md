# Troubleshooting

## Error messages

|Message|Steps to resolve|
|--|--|
|Can't determine project language from files|In an Azure Function app, this indicates the `./local.settings.json` file can't be found.|

## Static web app with API

Tip: Start the SWA CLI with the `--verbose=silly` to see the logs. 

|Issue|Resolution|
|--|--|
|When using SWA CLI to proxy requests from client to API, request to API fails.|The SWA CLI uses 4280 as the port to use to access both the client and its ability to reach the API. If you use the client's usual port instead of port 4280, you aren't using the proxy and the request to the API will fail.| 


## Azure Functions app

Tip: Start the Functions app with the `--verbose` to see the logs. 

|Issue|Resolution|
|--|--|
|`Can't determine project language from files. Please use one of [--csharp, --javascript, --typescript, --java, --python, --powershell, --custom]`|Create a `local.settings.json` file.| 

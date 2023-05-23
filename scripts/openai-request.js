import fetch from 'node-fetch';  
  
const openAiName = '';                    // resource name
const openAiDeployment = '';              // deployment name
const apiVersion = '2023-03-15-preview';
const apiKey = '';  
  
const requestBody = {  
  messages: [  
    { role: 'system', content: 'You are an AI assistant that helps people find information.' },  
    { role: 'user', content: 'hello' },  
    { role: 'assistant', content: 'Hello! How can I assist you today?' }  
  ],  
  max_tokens: 800,  
  temperature: 0.7,  
  frequency_penalty: 0,  
  presence_penalty: 0,  
  top_p: 0.95,  
  stop: null  
};  
  
fetch(`https://${openAiName}.openai.azure.com/openai/deployments/${openAiDeployment}/chat/completions?api-version=${apiVersion}`, {  
  method: 'POST',  
  headers: {  
    'Content-Type': 'application/json',  
    'api-key': apiKey  
  },  
  body: JSON.stringify(requestBody)  
})  
  .then(response => response.json())  
  .then(data => console.log(JSON.stringify(data)))  
  .catch(error => console.error(error)); 

// @ts-nocheck

//create a todo, view a todo, modify a todo, list all todos, delete all todos

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
// import { MongoClient } from 'mongodb';

let nextId = 2;

type Todo = {
  title: string;
}

let todos = {
  "1": "Say hello"
};


app.get('getAll', {
  route: "todo",
  authLevel: 'anonymous',
  handler: async function getAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    return { jsonBody: todos }
  }
})

// curl --location 'http://localhost:7071/api/users?user=mike' \
// --header 'Content-Type: application/json' \
// --data '{
//     "name": "dina",
//     "age": "21"
// }'

app.post('addOne', {
  route: "todo",
  authLevel: 'anonymous',
  handler: async function addOne(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const body = await request.json();
    console.log(body)

    if(body && body.title){
      todos[nextId++] = body.title;

      console.log(todos);
  
      return {
        jsonBody: body.title
      }
    }
    return { status: 404 }

  }
})


app.deleteRequest('deleteAll', {
  route: "todo",
  authLevel: 'anonymous',
  handler: async function deleteAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    todos = {};
    nextId=1;

    return {
      jsonBody: todos
    }
  }
})

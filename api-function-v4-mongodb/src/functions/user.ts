import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { connect, ConnectOptions } from 'mongoose';

import User from '../lib/dbUser'

let conn = null;

async function init(){
  try{
    if(!conn && process.env.MongoDbConnectionString){
      await connect(process.env.MongoDbConnectionString)
      console.log(`DB connection started`)
    } else if(!process.env.MongoDbConnectionString){
      console.log(`Connection string is`)
    } else {
      console.log(`DB connection reused`)
    }
  } catch(err){
    console.log(err.message)
  }

}

app.get('getAll', {
  route: "user",
  authLevel: 'anonymous',
  handler: async function getAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    try{
      await init();
      const allUsers = await User.find({})
  
      return {
        jsonBody: {
          users: allUsers
        }
      }
    } catch(err){
      return {
        status: 500,
        jsonBody: {
          err
        }
      }
    }

  }
})
/*
app.post('addOne', {
  route: "user",
  authLevel: 'anonymous',
  handler: async function addOne(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const body = await request.json();
    console.log(body)

    if (body && body["user"]) {

      const user = new User(body["user"]);
      await user.save();

      return {
        jsonBody: user
      }
    }
    return { status: 404 }

  }
})


app.deleteRequest('deleteAll', {
  route: "user",
  authLevel: 'anonymous',
  handler: async function deleteAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    return {
      jsonBody: User.deleteMany({})
    }
  }
})
*/

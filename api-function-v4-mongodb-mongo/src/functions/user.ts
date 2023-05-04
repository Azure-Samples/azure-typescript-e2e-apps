import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
//import { MongoClient } from 'mongodb';

const url = process.env.MongoDbConnectionString;
if(!url) throw Error("url for mongodb not found")
//const client = new MongoClient(url);

app.get('getAll', {
  route: "user",
  authLevel: 'anonymous',
  handler: async function getAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    try{
  //    await client.connect();
  //    const users = await client.db().collection('e2etestusers').find({});
  
  //    console.log(users);

      return {
        jsonBody: {
          users: []
        }
      }
    } catch(err){

      console.log(err)
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

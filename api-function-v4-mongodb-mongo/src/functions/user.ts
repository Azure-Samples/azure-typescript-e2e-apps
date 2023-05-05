import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { MongoClient } from 'mongodb';

const url = "mongodb://diberry-cosmosdb-mongodb:aP02zwVT74F2dDcm3hb8uX7lN2CKzkZwGuqCeF694ZxLjito8tDS9viEsnVU73QKhfR0Ih2IKWLfACDbr4w7hA==@diberry-cosmosdb-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@diberry-cosmosdb-mongodb@";
if (!url) throw Error("url for mongodb not found")
const client = new MongoClient(url);

app.get('getAll', {
  route: "user",
  authLevel: 'anonymous',
  handler: async function getAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    try {
      await client.connect();
      const users = await client.db().collection('e2etestusers').find({}).toArray();

      console.log(users);

      return {
        jsonBody: {
          users: users
        }
      }
    } catch (err) {

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

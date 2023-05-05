import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { MongoClient } from 'mongodb';

const url = process.env.MongoDbConnectionString;
if (!url) throw Error("url for mongodb not found")
// @ts-ignore
const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
const dbName = 'test';
const collectionName = "users";

/*
curl --location 'http://localhost:7071/api/user'
*/
app.get('getAll', {
  route: "user",
  authLevel: 'anonymous',
  handler: async function getAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    try {

      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      const users = await collection.find({}).toArray();

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
curl --location 'http://localhost:7071/api/user' \
--header 'Content-Type: application/json' \
--data '{"user":{"name":"hello", "age": "123"}}'
*/
app.post('addOne', {
  route: "user",
  authLevel: 'anonymous',
  handler: async function addOne(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    const body = await request.json();
    console.log(body)

    if (body && body["user"]) {

      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      const user = await collection.insertOne(body["user"]);
      return {
        jsonBody: user
      }
    }
    return { status: 404 }

  }
})

/*
curl --location --request DELETE 'http://localhost:7071/api/user'
*/
app.deleteRequest('deleteAll', {
  route: "user",
  authLevel: 'anonymous',
  handler: async function deleteAll(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const users = await collection.deleteMany();

    return {
      jsonBody: users
    }
  }
})


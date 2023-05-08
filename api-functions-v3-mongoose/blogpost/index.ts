import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import connection from '../lib/database';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
  
    context.log(context.bindingData);

    if(req.method === 'GET') {


        // curl --location 'http://localhost:7071/api/blogpost' --verbose

        const id = req.params.id || null;
        console.log('id', id);

        const blogposts = await connection.model('BlogPost').find({id});

        context.res = {
            status: 200,
            body: blogposts
        };  
    } else if (req.method === 'POST') {

        // curl -X POST --location 'http://localhost:7071/api/blogpost' --header 'Content-Type: application/json' --data '{"author":"dina","title":"my first post", "body":"hello jane"}' --verbose

        const { author, title, body } = req.body;
        const blogpost = await connection.model('BlogPost').create({ author, title, body });

        context.res = {
            status: 200,
            body: blogpost
        };  
    } else if (req.method === 'PUT') {

        // curl -X PUT --location 'http://localhost:7071/api/blogpost/?id=645658d690080282994574e2' --header 'Content-Type: application/json' --data '{"author":"jack","title":"my second post", "body":"hello jack"}' --verbose

        const id = req.query.id || null;
        console.log('id', id);
        if(!id) context.res = { status: 400, body: 'Id was not found' };

        const { title, body, author } = req.body;
        const blogpost = await connection.model('BlogPost').findByIdAndUpdate(id, { title, body, author }, { new: false },);
        context.res = {
            status: 200,
            body: blogpost
        };  
    } else if (req.method === 'DELETE') {

        // curl --location 'http://localhost:7071/api/blogpost?id=645658d690080282994574e2' --request DELETE --header 'Content-Type: application/json' --verbose

        const id = req.query.id || null;
        console.log('id', id);
        if(!id) context.res = { status: 400, body: 'Id was not founc' };

        const blogpost = await connection.model('BlogPost').findByIdAndDelete(id);
        context.res = {
            status: 200,
            body: blogpost
        };  
    } else {
        context.res = {
            status: 400,
            body: 'Please pass an id on the query string or in the request body'
        };
    }

};

export default httpTrigger;
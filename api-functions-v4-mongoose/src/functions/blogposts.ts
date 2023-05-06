import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import connection from '../lib/database';

export async function getBlogPosts(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function getBlogPosts processed request for url "${request.url}"`);

    const blogposts = await connection.model('BlogPost').find({});

    return {
        status: 200,
        jsonBody: {
            blogposts
        }
    };
};

app.get('getBlogPosts', {
    route: "blogposts",
    authLevel: 'anonymous',
    handler: getBlogPosts
});

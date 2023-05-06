import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import connection, { IBlogPost, IBlogPostDocument }  from '../lib/database';

// curl --location 'http://localhost:7071/api/blogpost/6456597918547e37d515bda3' --verbose
export async function getBlogPost(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function getBlogPosts processed request for url "${request.url}"`);

    console.log('request.params.id', request.params.id)
    const id = request.params.id;
    
    const blogPost = await connection.model('BlogPost').findOne({ _id: id });

    if(!blogPost) {
        return {
            status: 404,
            jsonBody: {
                message: 'Blog post not found'
            }
        };
    }

    return {
        status: 200,
        jsonBody: {
            blogPost
        }
    };
};

// curl -X POST --location 'http://localhost:7071/api/blogpost' --header 'Content-Type: application/json' --data '{"author":"dina","title":"my first post", "body":"hello jane"}' --verbose
export async function addBlogPost(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function addBlogPost processed request for url "${request.url}"`);

    const body = await request.json() as IBlogPost;

    const blogPostResult = await connection.model('BlogPost').create({
        author: body?.author,
        title: body?.title,
        body: body?.body
    });

    return {
        status: 200,
        jsonBody: {
            blogPostResult
        }
    };
};

// curl -X PUT --location 'http://localhost:7071/api/blogpost/64568e727f7d11e09eab473c' --header 'Content-Type: application/json' --data '{"author":"5 jack","title":"5 my second post", "body":"5 hello jack"}' --verbose
export async function updateBlogPost(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function updateBlogPost processed request for url "${request.url}"`);

    const body = await request.json() as IBlogPost;
    const id = request.params.id;

    const blogPostResult = await connection.model('BlogPost').updateOne({ _id: id }, {
        author: body?.author,
        title: body?.title,
        body: body?.body
    });

    if(blogPostResult.matchedCount === 0) {
        return {
            status: 404,
            jsonBody: {
                message: 'Blog post not found'
            }
        };
    }

    return {
        status: 200,
        jsonBody: {
            blogPostResult
        }
    };
};

// curl --location 'http://localhost:7071/api/blogpost/6456597918547e37d515bda3' --request DELETE --header 'Content-Type: application/json' --verbose
export async function deleteBlogPost(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function deleteBlogPost processed request for url "${request.url}"`);

    const id = request.params.id;

    const blogPostResult = await connection.model('BlogPost').deleteOne({ _id: id });

    if(blogPostResult.deletedCount === 0) {
        return {
            status: 404,
            jsonBody: {
                message: 'Blog post not found'
            }
        };
    }

    return {
        status: 200,
        jsonBody: {
            blogPostResult
        }
    };
};

app.get('getBlogPost', {
    route: "blogpost/{id}",
    authLevel: 'anonymous',
    handler: getBlogPost
});

app.post('postBlogPost', {
    route: "blogpost",
    authLevel: 'anonymous',
    handler: addBlogPost
});

app.put('putBlogPost', {
    route: "blogpost/{id}",
    authLevel: 'anonymous',
    handler: updateBlogPost
});

app.deleteRequest('deleteBlogPost', {
    route: "blogpost/{id}",
    authLevel: 'anonymous',
    handler: deleteBlogPost
});

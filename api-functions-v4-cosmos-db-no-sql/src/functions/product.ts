import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import CosmosDb, { IProduct, IProductInput} from '../lib/database';

const cosmosDb = new CosmosDb({
    key: process.env.COSMOSDB_Key,
    endpoint: process.env.COSMOSDB_Endpoint,
    databaseName: process.env.COSMOSDB_DatabaseName,
    containerName: process.env.COSMOSDB_ContainerName,
    partitionKeyPath: process.env.COSMOSDB_PartitionKeyPath
});

// curl --location 'http://localhost:7071/api/product/90f272d1-bd0c-4e49-afe6-858c17066e4b' --verbose
export async function getProduct(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`getProducts processing request for url "${request.url}, ${context.invocationId}"`);
    
    const id = request.params.id;
    
    const product = await cosmosDb.getProduct(id);

    if(!product) {
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
            product
        }
    };
};

// curl -X POST --location 'http://localhost:7071/api/product' --header 'Content-Type: application/json' --data '{"categoryId":"123","categoryName":"Components, RoadFrames", "sku":"abc", "name":"tires", "description":"asdfasdfasdf", "price":20}' --verbose
export async function addProduct(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`addProduct processing request for url "${request.url}, ${context.invocationId}"`);

    const body = await request.json() as IProductInput;

    const product: IProduct = await cosmosDb.addProduct({
        categoryId: body?.categoryId,
        categoryName: body?.categoryName,
        sku: body?.sku,
        name: body?.name,
        description: body?.description,
        price: body?.price
    })

    return {
        status: 200,
        jsonBody: {
            product
        }
    };
};

// curl -X PUT --location 'http://localhost:7071/api/product/90f272d1-bd0c-4e49-afe6-858c17066e4b' --header 'Content-Type: application/json' --data '{"categoryId":"123asdasdasd","categoryName":"Components, RoadFrames asdasdasd", "sku":"abc", "name":"tires", "description":"qwertyuiop", "price":30}' --verbose
export async function updateProduct(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`updateProduct processing request for url "${request.url}, ${context.invocationId}"`);

    const body = await request.json() as IProduct;
    const id = request.params.id;

    const ProductResult = await cosmosDb.updateProduct(id, {
        categoryId: body?.categoryId,
        categoryName: body?.categoryName,
        sku: body?.sku,
        name: body?.name,
        description: body?.description,
        price: body?.price
    });

    return {
        status: 200,
        jsonBody: {
            ProductResult
        }
    };
};

// curl --location 'http://localhost:7071/api/product/90f272d1-bd0c-4e49-afe6-858c17066e4b' --request DELETE --header 'Content-Type: application/json' --verbose
export async function deleteProduct(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`deleteProduct processing request for url "${request.url}, ${context.invocationId}"`);

    const id = request.params.id;

    const ProductResult = await cosmosDb.deleteProduct(id);

    return {
        status: 200,
        jsonBody: {
            ProductResult
        }
    };
};

app.get('getProduct', {
    route: "product/{id}",
    authLevel: 'anonymous',
    handler: getProduct
});

app.post('postProduct', {
    route: "product",
    authLevel: 'anonymous',
    handler: addProduct
});

app.put('putProduct', {
    route: "product/{id}",
    authLevel: 'anonymous',
    handler: updateProduct
});

app.deleteRequest('deleteProduct', {
    route: "product/{id}",
    authLevel: 'anonymous',
    handler: deleteProduct
});

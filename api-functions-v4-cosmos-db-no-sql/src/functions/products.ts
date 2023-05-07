import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import CosmosDb from '../lib/database';

const cosmosDb = new CosmosDb({
    key: process.env.COSMOSDB_Key,
    endpoint: process.env.COSMOSDB_Endpoint,
    databaseName: process.env.COSMOSDB_DatabaseName,
    containerName: process.env.COSMOSDB_ContainerName,
    partitionKeyPath: process.env.COSMOSDB_PartitionKeyPath
});

// curl --location 'http://localhost:7071/api/products' --verbose
export async function getProducts(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`getProducts processing request for url "${request.url}, ${context.invocationId}"`);

    const products = await cosmosDb.getProducts();

    return {
        status: 200,
        jsonBody: {
            products
        }
    };
};

app.get('getProducts', {
    route: "products",
    authLevel: 'anonymous',
    handler: getProducts
});

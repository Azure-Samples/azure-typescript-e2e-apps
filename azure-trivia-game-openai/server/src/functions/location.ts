import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import getLocation from '../lib/location/location';
import startupInstance, { StartupData, StartupResponse} from "../lib/startup/startup";

type LocationPostBody = {
    lat: number;
    long: number;
};

const startupResponse = startupInstance.getData();

export async function location(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Location Http function processed request for url "${request.url}"`);

    if(startupResponse.status !== 200) return {
        status: startupResponse.status,
        jsonBody: { error: startupResponse.errors }
    }

    const body = await request.json();
    console.log(body);

    const { lat, long } = body as LocationPostBody;

    if (!lat || !long) {
        return { status: 400, jsonBody: { error: "Missing lat or long" } };
    }
    context.log(`Location - lat ${lat} , long ${long}`)

    const { status, data, error } = await getLocation( lat, long, startupResponse.data);

    context.log(data);
    context.log(status);
    

    return {
        status: status,
        jsonBody: data
    };
};

app.http('location', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: location
});

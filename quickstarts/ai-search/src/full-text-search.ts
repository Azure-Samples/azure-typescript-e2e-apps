import { SearchIndexClient, SimpleField, ComplexField, SearchSuggester, SearchClient, AzureKeyCredential, odata, SearchIndex } from "@azure/search-documents";
import indexDefinition from './hotels_quickstart_index.json' with { type: "json" };
import hotelData from './hotels.json' with { type: "json" };
import 'dotenv/config'

// Getting endpoint and apiKey from .env file
const endpoint: string = process.env.SEARCH_API_ENDPOINT!!;
const apiKey: string = process.env.SEARCH_API_KEY!!;
if (!endpoint || !apiKey) {
    throw new Error ("Make sure to set valid values for endpoint and apiKey with proper authorization.");
}

function printSearchIndex(searchIndex:SearchIndex){
    const { name, etag, defaultScoringProfile } = searchIndex;
    console.log(`Search Index name: ${name}, etag: ${etag}, defaultScoringProfile: ${defaultScoringProfile}`);
}

type MyIndexDefinition = {
    name: string;
    fields: SimpleField[] | ComplexField[];
    suggesters: SearchSuggester[];
}
type Hotel = {
    HotelId: string;
    HotelName: string;
    Description: string;
    Description_fr: string;
    Category: string;
    Tags: string[],
    ParkingIncluded: string | boolean,
    LastRenovationDate: string,
    Rating: number,
    Address: Address,
  };
type Address = {
    StreetAddress: string;
    City: string;
    StateProvince: string;
    PostalCode: string;
  };

// Get Incoming Data
const indexDef: SearchIndex = indexDefinition as MyIndexDefinition;
const hotels: Hotel[] = hotelData['value'];

async function createIndex(searchIndexClient: SearchIndexClient, indexName: string, searchIndex: SearchIndex) {
    console.log(`Running Azure AI Search JavaScript quickstart...`);
 
    // Create a new SearchIndexClient
    const indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(apiKey));

    // Delete the index if it already exists
    indexName 
        ? await indexClient.deleteIndex(indexName) 
        : console.log('Index doesn\'t exist.');

    console.log('Creating index...');
    const newIndex: SearchIndex = await indexClient.createIndex(searchIndex);

    // Print the new index
    printSearchIndex(newIndex);
}
async function loadData(searchClient:SearchClient, indexName: string, hotels: Hotel[]) {
    console.log('Uploading documents...');

    let indexDocumentsResult = await searchClient.mergeOrUploadDocuments(hotels);
    
    console.log(`Index operations succeeded: ${JSON.stringify(indexDocumentsResult.results[0].succeeded)}`);
}

async function main(indexName: string, indexDef: SearchIndex, hotels: Hotel[]) {

    // Create a new SearchIndexClient
    const indexClient = new SearchIndexClient(endpoint, new AzureKeyCredential(apiKey));
    const searchClient = new SearchClient<Hotel[]>(endpoint, indexName, new AzureKeyCredential(apiKey));
    await createIndex(indexClient, indexName, indexDef);
    await loadData(searchClient, indexName, hotels);
}

main(indexDefinition?.name, indexDef, hotels).catch((err) => {
    console.error("The sample encountered an error:", err);
});
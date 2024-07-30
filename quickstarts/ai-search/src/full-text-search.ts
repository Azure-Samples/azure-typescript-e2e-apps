import {
  SearchIndexClient,
  SimpleField,
  ComplexField,
  SearchSuggester,
  SearchClient,
  SearchDocumentsResult,
  AzureKeyCredential,
  odata,
  SearchFieldArray,
  SearchIndex,
} from "@azure/search-documents";
import "dotenv/config";

// Import data
import indexDefinition from "./hotels_quickstart_index.json" with { type: "json" };
import hotelData from "./hotels.json" with { type: "json" };

// Get endpoint and apiKey from .env file
const endpoint: string = process.env.SEARCH_API_ENDPOINT!!;
const apiKey: string = process.env.SEARCH_API_KEY!!;
if (!endpoint || !apiKey) {
  throw new Error(
    "Make sure to set valid values for endpoint and apiKey with proper authorization.",
  );
}

function printSearchIndex(searchIndex: SearchIndex) {
  const { name, etag, defaultScoringProfile } = searchIndex;
  console.log(
    `Search Index name: ${name}, etag: ${etag}, defaultScoringProfile: ${defaultScoringProfile}`,
  );
}
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type MyIndexDefinition = {
  name: string;
  fields: SimpleField[] | ComplexField[];
  suggesters: SearchSuggester[];
};
type Hotel = {
  HotelId: string;
  HotelName: string;
  Description: string;
  Description_fr: string;
  Category: string;
  Tags: string[];
  ParkingIncluded: string | boolean;
  LastRenovationDate: string;
  Rating: number;
  Address: Address;
};
type Address = {
  StreetAddress: string;
  City: string;
  StateProvince: string;
  PostalCode: string;
};

// Get Incoming Data
const indexDef: SearchIndex = indexDefinition as MyIndexDefinition;
const hotels: Hotel[] = hotelData["value"];

async function createIndex(
  searchIndexClient: SearchIndexClient,
  indexName: string,
  searchIndex: SearchIndex,
) {
  console.log(`Running Azure AI Search JavaScript quickstart...`);

  // Delete the index if it already exists
  indexName
    ? await searchIndexClient.deleteIndex(indexName)
    : console.log("Index doesn't exist.");

  console.log("Creating index...");
  const newIndex: SearchIndex = await searchIndexClient.createIndex(searchIndex);

  // Print the new index
  printSearchIndex(newIndex);
}
async function loadData(
  searchClient: any,
  hotels: any,
) {
  console.log("Uploading documents...");

  let indexDocumentsResult = await searchClient.mergeOrUploadDocuments(hotels);

    console.log(JSON.stringify(indexDocumentsResult));

  console.log(
    `Index operations succeeded: ${JSON.stringify(indexDocumentsResult.results[0].succeeded)}`,
  );
}

async function searchAllReturnAllFields(
  searchClient: SearchClient<Hotel>,
  searchText: string,
) {
  console.log("Query #1 - return everything:");

  // Search Options
  // Without `select` property, all fields are returned
  const searchOptions = { includeTotalCount: true };

  // Search
  const { count, results } = await searchClient.search(
    searchText,
    searchOptions,
  );

  // Show results
  for await (const result of results) {
    console.log(`${JSON.stringify(result.document)}`);
  }

  // Show results count
  console.log(`Result count: ${count}`);
}
async function searchAllSelectReturnedFields(
  searchClient: SearchClient<Hotel>,
  searchText: string,
) {
  console.log("Query #2 - search everything:");

  // Search Options
  // Narrow down the fields to return
  const selectFields: SearchFieldArray<Hotel> = [
    "HotelId",
    "HotelName",
    "Rating",
  ];
  const searchOptions = { includeTotalCount: true, select: selectFields };

  // Search
  const { count, results }: SearchDocumentsResult<Hotel> =
    await searchClient.search(searchText, searchOptions);

  // Show results
  for await (const result of results) {
    console.log(`${JSON.stringify(result.document)}`);
  }

  // Show results count
  console.log(`Result count: ${count}`);
}
async function searchWithFilterOrderByAndSelect(
  searchClient: SearchClient<Hotel>,
  searchText: string,
  filterText: string,
) {
  console.log("Query #3 - Search with filter, orderBy, and select:");

  // Search Options
  // Narrow down the fields to return
  const searchOptions = {
    filter: odata`Address/StateProvince eq ${filterText}`,
    orderBy: ["Rating desc"],
    select: ["HotelId", "HotelName", "Rating"] as const, // Select only these fields
  };
  type SelectedHotelFields = Pick<Hotel, "HotelId" | "HotelName" | "Rating">;

  // Search
  const { count, results }: SearchDocumentsResult<SelectedHotelFields> =
    await searchClient.search(searchText, searchOptions);

  // Show results
  for await (const result of results) {
    console.log(`${JSON.stringify(result.document)}`);
  }

  // Show results count
  console.log(`Result count: ${count}`);
}
async function searchWithLimitedSearchFields(
  searchClient: SearchClient<Hotel>,
  searchText: string,
) {
  console.log("Query #4 - Limit searchFields:");

  // Search Options
  const searchOptions = {
    select: ["HotelId", "HotelName", "Rating"] as const, // Select only these fields
    searchFields: ["HotelName"] as const,
  };
  type SelectedHotelFields = Pick<Hotel, "HotelId" | "HotelName" | "Rating">;

  // Search
  const { count, results }: SearchDocumentsResult<SelectedHotelFields> =
    await searchClient.search(searchText, searchOptions);

  // Show results
  for await (const result of results) {
    console.log(`${JSON.stringify(result.document)}`);
  }

  // Show results count
  console.log(`Result count: ${count}`);
}
async function searchWithFacets(
  searchClient: SearchClient<Hotel>,
  searchText: string,
) {
  console.log("Query #5 - Use facets:");

  // Search Options
  const searchOptions = {
    facets: ["Category"], //For aggregation queries
    select: ["HotelId", "HotelName", "Rating"] as const, // Select only these fields
    searchFields: ["HotelName"] as const,
  };
  type SelectedHotelFields = Pick<Hotel, "HotelName">;

  // Search
  const { count, results }: SearchDocumentsResult<SelectedHotelFields> =
    await searchClient.search(searchText, searchOptions);

  // Show results
  for await (const result of results) {
    console.log(`${JSON.stringify(result.document)}`);
  }

  // Show results count
  console.log(`Result count: ${count}`);
}
async function lookupDocumentById(
  searchClient: SearchClient<Hotel>,
  key: string,
) {
  console.log("Query #6 - Lookup document:");

  // Get document by ID
  // Full document returned, destructured into id and name
  const { HotelId: id, HotelName: name }: Hotel =
    await searchClient.getDocument(key);

  // Show results
  console.log(`HotelId: ${id}, HotelName: ${name}`);
}

async function main(indexName: string, indexDef: SearchIndex, hotels: Hotel[]) {
  // Create a new SearchIndexClient
  const indexClient = new SearchIndexClient(
    endpoint,
    new AzureKeyCredential(apiKey),
  );

  // Create the index
  await createIndex(indexClient, indexName, indexDef);

  const searchClient = indexClient.getSearchClient(indexName);
  //const searchClient = new SearchClient(endpoint, indexName, new AzureKeyCredential(apiKey));


  // Load with data
  console.log("Loading data...", indexName);
  await loadData(searchClient, hotels);

  wait(10000);

  // Search index
//   await searchAllReturnAllFields(searchClient, "*");
//   await searchAllSelectReturnedFields(searchClient, "*");
//   await searchWithFilterOrderByAndSelect(searchClient, "wifi", "FL");
//   await searchWithLimitedSearchFields(searchClient, "sublime cliff");
//   await searchWithFacets(searchClient, "*");
//   await lookupDocumentById(searchClient, "3");
}

main(indexDefinition?.name, indexDef, hotels).catch((err) => {
  console.error("The sample encountered an error:", err);
});

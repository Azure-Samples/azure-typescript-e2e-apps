import {
  SearchIndexClient,
  SimpleField,
  ComplexField,
  SearchSuggester,
  SearchClient,
  SearchDocumentsResult,
  AzureKeyCredential,
  odata,
  SearchOptions,
  SearchFieldArray,
  SearchIndex,
} from "@azure/search-documents";
import indexDefinition from "./hotels_quickstart_index.json" with { type: "json" };
import hotelData from "./hotels.json" with { type: "json" };
import "dotenv/config";

// Getting endpoint and apiKey from .env file
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

  // Create a new SearchIndexClient
  const indexClient = new SearchIndexClient(
    endpoint,
    new AzureKeyCredential(apiKey),
  );

  // Delete the index if it already exists
  indexName
    ? await indexClient.deleteIndex(indexName)
    : console.log("Index doesn't exist.");

  console.log("Creating index...");
  const newIndex: SearchIndex = await indexClient.createIndex(searchIndex);

  // Print the new index
  printSearchIndex(newIndex);
}
async function loadData(
  searchClient: SearchClient<Hotel>,
  indexName: string,
  hotels: Hotel[],
) {
  console.log("Uploading documents...");

  let indexDocumentsResult = await searchClient.mergeOrUploadDocuments(hotels);

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
  const searchClient = new SearchClient<Hotel>(
    endpoint,
    indexName,
    new AzureKeyCredential(apiKey),
  );

  // Create the index
  await createIndex(indexClient, indexName, indexDef);

  // Load with data
  await loadData(searchClient, indexName, hotels);

  wait(1000);

  // Search index
  await searchAllReturnAllFields(searchClient, "luxury hotels");
  await searchAllSelectReturnedFields(searchClient, "luxury hotels");
  await searchWithFilterOrderByAndSelect(searchClient, "wifi", "FL");
  await searchWithLimitedSearchFields(searchClient, "sublime cliff");
  await searchWithFacets(searchClient, "*");
  await lookupDocumentById(searchClient, "3");
}

main(indexDefinition?.name, indexDef, hotels).catch((err) => {
  console.error("The sample encountered an error:", err);
});

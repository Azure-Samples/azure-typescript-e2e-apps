// Get id of all secrets
export async function listSecretIds(client) {
  if (!client) return;

  const secretIds = [];

  for await (const secretProperties of client.listPropertiesOfSecrets()) {
    secretIds.push(secretProperties.id);
  }

  return secretIds;
}

// Get name of all secrets
export async function listSecretNames(client) {
  if (!client) return;

  const secretNames = [];

  for await (const secretProperties of client.listPropertiesOfSecrets()) {
    secretNames.push(secretProperties.name);
  }

  return secretNames;
}

// If secret name is empty, get all secrets' versions
export async function listSecretVersions(client, secretName) {
  if (!client || !secretName) return;

  const versions = [];

  for await (const secretProperties of client.listPropertiesOfSecretVersions(
    secretName,
  )) {
    const secret = await client.getSecret(secretName, {
      version: secretProperties?.version,
    });

    versions.push({
      name: secretName,
      version: secretProperties?.version,
      value: secret.value,
      createdOn: secretProperties?.createdOn,
    });
  }

  // return all versions of secret
  return versions;
}
export async function listSecretsByPage(client, maxResults = 3) {
  if (!client) return;

  const pages = [];

  for await (const page of client.listPropertiesOfSecrets().byPage({
    maxPageSize: maxResults,
  })) {
    for (const secretProperties of page) {
      console.log(`${secretProperties.name} - ${secretProperties.version}`);
    }
    pages.push(page);
  }

  return pages;
}
export async function listSecretVersionsByPage(
  client,
  secretName,
  maxResults = 3,
) {
  if (!client) return;

  const pages = [];

  for await (const page of client.listPropertiesOfSecretVersions(secretName).byPage({
    maxPageSize: maxResults,
  })) {
    pages.push(page);
  }

  return pages;
}
export async function listDeletedSecretsByPage(client, maxResults = 3) {
  if (!client) return;

  const pages = [];

  for await (const page of client.listDeletedSecrets().byPage({
    maxPageSize: maxResults,
  })) {
    pages.push(page);
  }
  return pages;
}

  // Find all secrets/versions by property (List with filter by property)
  // Tags nested object compared via JSON.stringify
  export async function findSecretVersionsByProperty(
    client,
    propertyName,
    propertyValue,
  ) {
    if (!client) return;

    // each version is a different secret in array
    const secrets = [];

    for await (const secretProperties of client.listPropertiesOfSecretVersions(
      secretName,
    )) {
      
      const foundSecretVersion = (propertyName === 'tags')
          // do 
          ? (JSON.stringify(secretProperties.tags) === JSON.stringify(propertyValue)) ? true : false
          : ( secretProperties && secretProperties[propertyName] && secretProperties[propertyName] === propertyValue) ? true: false
        
      if(foundSecretVersion){
        secrets.push({ name: secretProperties.name, version: secretProperties.version })
      }

    // return all versions of all secrets
    return secrets;
  }
  export async function findCurrentSecretsByProperty(
    client,
    propertyName,
    propertyValue,
  ) {
    if (!client) return;

    // each version is a different secret in array
    const secrets = [];

    for await (const secretProperties of client.listPropertiesOfSecrets()) {
      if (propertyName === 'tags') {
        if (
          JSON.stringify(secretProperties.tags) === JSON.stringify(propertyValue)
        ) {
          secrets.push({
            name: secretProperties.name,
            version: secretProperties.version,
          });
        }
      } else if (
        secretProperties
        && secretProperties[propertyName]
        && secretProperties[propertyName] === propertyValue
      ) {
        secrets.push({
          name: secretProperties.name,
          version: secretProperties.version,
        });
      }
    }

    // return all versions of all secrets
    return secrets;
  }
  export async function findCurrentSecretVersionByVersionId(client, versionId) {
    if (!client) return;

    // each version is a different secret in array
    const secret = undefined;

    for await (const secretProperties of client.listPropertiesOfSecrets()) {
      if (secretProperties.versionId === versionId) {
        secret = {
          name: secretProperties.name,
          version: secretProperties.version,
        };
        break;
      }
    }

    // return all versions of all secrets
    return secret;
  }

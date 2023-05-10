/*

  Create new secret
  Update existing secret value and properties - should pass in existing properties if not updating
  If you only want to update properties, use updateSecretProperties
*/
export async function createSecret(client, secretName, secretValue, secretProperties) {

  if(!client || !secretName || !secretValue) return;

    const { name, value, properties } = await client.setSecret(
      secretName,
      secretValue, 
      secretProperties
    );
  
    return { name, value, properties };
}

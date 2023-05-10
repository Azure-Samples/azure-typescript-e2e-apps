export async function deleteSecretSoftAndWaitUntilDone(client, secretName) {

  if(!client || !secretName) return;

  const deletePoller = await client.beginDeleteSecret(secretName);
  const deleteResult = await deletePoller.pollUntilDone();
  return deleteResult;
}
export async function recoverDeletedSecretAndWaitUntilDone(client, secretName) {

  if(!client || !secretName) return;

  const recoverPoller = await client.beginRecoverDeletedSecret(secretName);
  const recoverResult = await recoverPoller.pollUntilDone();
  return recoverResult;
}
export async function purgeDeletedSecretAndWaitUntilDone(client, secretName) {

  if(!client || !secretName) return;

  // Wait for purge to complete
  const purgePoller = await client.purgeDeletedSecret(secretName);
  const purgeResult = await purgePoller.pollUntilDone();
  return purgeResult;
}
export async function getDeletedSecret(client, secretName) {

  if(!client || !secretName) return;

  // Get the deleted secret
  const deletedSecret = await client.getDeletedSecret(secretName);
  return deletedSecret;
}

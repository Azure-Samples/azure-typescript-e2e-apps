// Backup all versions of the secret
// This operation requires the secrets/backup permission.
export async function backupSecret(client, secretName){
    if (!client || !secretName) return;
    const backupResultBundle = await client.backupSecret(secretName);
    return backupResultBundle;
}
// Restore all versions of the secret
export async function restoreSecret(client, backupResultBundle){
    if (!client || !backupResultBundle) return;
    const restoreResult = await client.restoreSecretBackup(backupResultBundle);
    return restoreResult;
}

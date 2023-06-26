# Key vault secrets dev guide

## Quickstart

* [Quickstart](https://learn.microsoft.com/azure/key-vault/secrets/quick-create-node?tabs=linux)

## Azure Key Vault secrets

* [Reference docs](https://learn.microsoft.com/javascript/api/overview/azure/keyvault-secrets-readme?view=azure-node-latest)


## .env

1. Create `.env.development` file with Key vault name

    ```
    KEY_VAULT_NAME=my-keyvault
    KEY_VAULT_NAME_2=my-keyvault
    ```

2. Sign into Azure with [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) to execute scripts

    ```bash
    az login
    ```

## Dev Guide

* Getting started
    * Authentication and client object creation
* Secrets
    * Set, update, rotate
        * Set secret
        * Set secret with properties (tags, content type, enabled, not before, expires)
        * Update secret - create new version of existing secret
        * Update secret properties
        * Rotate - link to existing tutorials about Fns and rotation
    * Get
        * Current version
        * Get all versions of a secret
        * Get disabled secret value - not allowed, must enable first
    * Enable and disable
        * Enable secret
        * Disable secret
    * Delete
        * Soft delete
        * Soft delete with poller wait until done
        * Recover deleted secret
        * Purge deleted secret
        * Purge all deleted secrets
    * Find
        * Find current secret version by property (List with filter by property)
        * Find all secrets/versions by property (List with filter by property)
        * Find secret by version id
    * List
        * List secrets, list with paging
        * List latst version of secrets, list with paging
        * List deleted secrets, list with paging
        * List current secret by tag
    * Backup
        * Backup secret
        * Restore secret

# Create JWK

* [JWT](https://jwt.io/introduction/)
* [Create JWK](https://mkjwk.org/)
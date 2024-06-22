# https://learn.microsoft.com/en-us/cli/azure/identity 
az identity create \
--name MigrationIdentity \
--resource-group <resource-group>

# Associate the managed identity with your web app
# https://learn.microsoft.com/en-us/cli/azure/identity
az identity show \
--name MigrationIdentity \
-g <your-identity-resource-group-name> \
--query id

# Azure App Service
az webapp identity assign \
--resource-group <resource-group-name> \
--name <webapp-name> \
--identities <managed-identity-id>

# Azure Spring Apps
az spring app identity assign \
--resource-group <resource-group-name> \
--name <app-name> \
--service <service-name> \
--user-assigned <managed-identity-id>

# Azure Container Apps
az containerapp identity assign \
--resource-group <resource-group-name> \
--name <app-name> \
--user-assigned <managed-identity-id>

# Azure Virtual Manchines
az vm identity assign \
--resource-group <resource-group-name> \
--name <virtual-machine-name> \
--identities <managed-identity-id>

# Azure Kubernetes Service
az aks update \
--resource-group <resource-group-name> \
--name <cluster-name> \
--enable-managed-identity \
--assign-identity <managed-identity-id> \
--assign-kubelet-identity <managed-identity-id>
# Define variables
subscription="YOUR_SUBSCRIPTION_ID"  # Replace with your actual subscription ID
resource_group="YOUR_RESOURCE_GROUP"  # Replace with your actual resource group name
project_name="YOUR_PROJECT_NAME"  # Replace with your actual project name

# Get the current logged in user and their object ID
echo "Getting details of the currently logged in user..."
current_user=$(az ad signed-in-user show --query userPrincipalName --output tsv)
echo "Current logged in user: $current_user"
assignee_object_id=$(az ad signed-in-user show --query id --output tsv)
echo "Object ID: $assignee_object_id"

# Define resource and scope
resource_type="Microsoft.CognitiveServices/accounts"
resource_name="${project_name}"
scope="/subscriptions/$subscription/resourceGroups/$resource_group/providers/${resource_type}/${resource_name}"

# Use variables in the command
az role assignment create \
  --role "Azure AI User" \
  --scope "$scope" \
  --assignee-object-id "$assignee_object_id" \
  --assignee-principal-type User
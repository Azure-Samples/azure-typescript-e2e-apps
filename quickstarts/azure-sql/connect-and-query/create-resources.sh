subscription="REPLACE-WITH-YOUR-SUBSCRIPTION" # add subscription here

az account set -s $subscription # ...or use 'az login'

# Variable block
let "randomIdentifier=$RANDOM*$RANDOM"
location="East US"
resourceGroup="msdocs-azuresql-rg-$randomIdentifier"
tag="create-and-configure-database"
server="msdocs-azuresql-server-$randomIdentifier"
database="msdocsazuresqldb$randomIdentifier"
login="azureuser"
password="Pa$$w0rD-$randomIdentifier"
# Specify appropriate IP address values for your environment
# to limit access to the SQL Database server
startIp=76.22.73.183
endIp=76.22.73.183

echo "Using resource group $resourceGroup with login: $login, password: $password..."

echo "Creating $resourceGroup in $location..."
az group create --name $resourceGroup --location "$location" --tags $tag

echo "Creating $server in $location..."
az sql server create --name $server --resource-group $resourceGroup --location "$location" --admin-user $login --admin-password $password

echo "Configuring firewall..."
az sql server firewall-rule create --resource-group $resourceGroup --server $server -n AllowYourIp --start-ip-address $startIp --end-ip-address $endIp

echo "Creating $database in serverless tier"
az sql db create --resource-group $resourceGroup --server $server --name $database --sample-name AdventureWorksLT --edition GeneralPurpose --compute-model Serverless --family Gen5 --capacity 2


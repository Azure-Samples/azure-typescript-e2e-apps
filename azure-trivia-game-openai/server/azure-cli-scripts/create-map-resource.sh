az maps account create --name map1 --resource-group game --sku S0 

az maps account keys list --name map1 --resource-group game --query 'primaryKey'  

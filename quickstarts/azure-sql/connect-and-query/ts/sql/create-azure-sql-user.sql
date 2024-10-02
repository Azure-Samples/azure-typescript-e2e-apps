    CREATE USER <your-app-service-name> FROM EXTERNAL PROVIDER;
    ALTER ROLE db_datareader ADD MEMBER <your-app-service-name>;
    ALTER ROLE db_datawriter ADD MEMBER <your-app-service-name>;
    ALTER ROLE db_ddladmin ADD MEMBER <your-app-service-name>;
    GO
CREATE USER [user-assigned-identity-name] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [user-assigned-identity-name];
ALTER ROLE db_datawriter ADD MEMBER [user-assigned-identity-name];
ALTER ROLE db_ddladmin ADD MEMBER [user-assigned-identity-name];
GO
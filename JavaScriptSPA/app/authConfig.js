const msalConfig = {
    auth: {
      clientId: "57f07842-f3d1-46d7-aa43-9793cb96c2cd",
      authority: "https://login.microsoftonline.com/59481093-5643-41c0-9d60-65840e5c82a0",
      redirectUri: "http://localhost:3000",
    },
    cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you're having issues on Internet Explorer 11 or Edge
    }
  };

  // Add scopes for the ID token to be used at Microsoft identity platform endpoints.
  const loginRequest = {
    scopes: ["openid", "profile", "User.Read"]
  };

  // Add scopes for the access token to be used at Microsoft Graph API endpoints.
  const tokenRequest = {
    scopes: ["Mail.Read"]
  };
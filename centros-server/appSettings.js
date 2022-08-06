const appSettings = () => {

    let port, baseUri;

    port = parseInt(process.env.PORT) || 8080;
    baseUri = `${process.env.BASE_URI}`;
    console.log(`running at ${baseUri}`)

    const app_settings_vals = {
        "host": {
            "port": port,
            "baseUri": baseUri,
            "ver": "0.0.1"
        },
        "credentials": {
            "clientId": process.env.AAD_CLIENT_ID,
            "tenantId": process.env.AAD_TENANT_ID,
            "clientSecret": process.env.AAD_CLIENT_SECRET,
        },
        "settings": {
            "homePageRoute": "/register",
            "redirectUri": `${baseUri}/redirect`,
            "postLogoutRedirectUri": `${baseUri}/`
        },
        "resources": {
            "graphAPI": {
                "callingPageRoute": "/api/me",
                "endpoint": "https://graph.microsoft.com/v1.0/me",
                "scopes": ["user.read"]
            },
            // "armAPI": {
            //     "callingPageRoute": "/tenant",
            //     "endpoint": "https://management.azure.com/tenants?api-version=2020-01-01",
            //     "scopes": ["https://management.azure.com/user_impersonation"]
            // }
        }

    }
    return app_settings_vals;
}

module.exports = appSettings;
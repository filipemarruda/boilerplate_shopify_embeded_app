Shopify Embedded App in Node.js
===============================

1 . Just point -settings.json files to your store.

```
    {
        "oauth": {
            "appName" : "myamazingapp",
            "api_key": "** Your Api Key **",
            "client_secret": "** Your Client/Shared Secret **",
            "redirect_url": "https://myamazingapp.com/auth_token",
            "scope": "read_products, write_products" // here, goes yours scopes
        }
    }
```

2 . Create your app and add an admin link pointing to root of your app.
```
    http://myamazingapp.com/
```
To install the app as a private apps, access the root of your app with a ```shop``` url parameter having the domain name of your store, example:
```
    http://myamazingapp.com/?shop=myamazingstore.myshopify.com
```
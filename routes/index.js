/*
 * Shopify Embedded App. skeleton.
 *
 * Copyright 2014 Richard Bremner
 * richard@codezuki.com
 */


var app = require('../app');
var url = require("url");
var querystring = require('querystring');
var Shopify = require('shopify-api-node');

/*
 * Get /
 *
 * if we already have an access token then
 * redirect to render the app, otherwise
 * redirect to app authorisation.
 */
exports.index = function(req, res){

    var parsedUrl = url.parse(req.originalUrl, true);
    
    if(!parsedUrl.query.shop){
        
        res.render('error');

    } else{

        var shopName = parsedUrl.query.shop.replace(".myshopify.com", "");
        var shopUrl = 'https://' + parsedUrl.query.shop;

        if(!req.session.oauth_access_token){

            if (parsedUrl.query && parsedUrl.query.id) {
                req.session.product_id = parsedUrl.query.id;
            }

            if(parsedUrl.query && parsedUrl.query.shop){

                const nonce = app.shopifyToken.generateNonce();
                const redirectUrl = app.shopifyToken.generateAuthUrl(shopName, app.nconf.get('oauth:scope'), nonce);
                res.redirect(redirectUrl);

            }

        } else {

            var product_id = parsedUrl.query.id || req.session.product_id;
            delete req.session.product_id;

            if (product_id) {

                const shopify = new Shopify({
                    shopName: shopName,
                    accessToken: req.session.oauth_access_token
                });
                
                shopify.product.get(product_id).then((product) => {
                    
                    res.render('app_view', {
                        productId: product.id,
                        title: product.title,
                        apiKey: app.nconf.get('oauth:api_key'),
                        shopUrl: shopUrl
                    });

                }).catch(err => console.error(err));

            } else{

                res.render('success', {
                    apiKey: app.nconf.get('oauth:api_key'),
                    shopUrl: shopUrl,
                    title : "Success"
                });

            }

        }

    }

};

/*
* Get /auth_token
*
* get the permanent access token which is valid
* for the lifetime of the app install, it does
* not expire
*/
this.getAccessToken = function(req, res) {

    var parsedUrl = url.parse(req.originalUrl, true);
    var shopName = parsedUrl.query.shop.replace(".myshopify.com", "");
    var shopUrl = 'https://' + parsedUrl.query.shop;

    app.shopifyToken.getAccessToken(parsedUrl.query.shop, parsedUrl.query.code).then((token) => {
        
        req.session.oauth_access_token = token;
        res.redirect(shopUrl + '/admin/apps/' + app.nconf.get('oauth:appName') + "?shop=" + parsedUrl.query.shop);

    }).catch((err) => {
        
        res.send(500);
        console.err(err);
        return;

    });

};
/*
 * Get /render_app
 *
 * render the main app view
 */
exports.showProductId = function(req, res){

    var parsedUrl = url.parse(req.originalUrl, true);
    res.render('product_id', {
        productId: parsedUrl.query.product_id
    });
};

/*
 * Shopify Embedded App. skeleton.
 *
 * Copyright 2014 Richard Bremner
 * richard@codezuki.com
 */

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var nconf = require('nconf');
var morgan = require('morgan');
var ShopifyToken = require('shopify-token');
var session = require('express-session');

//load settings from environment config
nconf.argv().env().file({
    file: (process.env.NODE_ENV || 'dev') + '-settings.json'
});

exports.nconf = nconf;

exports.shopifyToken = new ShopifyToken({
    sharedSecret: nconf.get('oauth:client_secret'),
    redirectUri: nconf.get('oauth:redirect_url'),
    apiKey: nconf.get('oauth:api_key')
});

//configure express
var app = express();

//log all requests
app.use(morgan('combined'));

//support json and url encoded requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//setup encrypted session cookies
app.use(cookieParser());
// app.use(cookieSession({
//     secret: "--express-session-encryption-key--"
// }));
app.use(session({
    secret: 'Uxudsa87d9sa000dsAiid',
    saveUninitialized: false,
    resave: false
}));

//statically serve from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// use html to render the views
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//use the environment's port if specified
app.set('port', process.env.PORT || 3000);

//configure routes
app.get('/', routes.index);
app.get('/auth_token', routes.getAccessToken);
app.get('/showProductId', routes.showProductId);

app.listen(app.get('port'), function () {
    console.log('Listening on port ' + app.get('port'));
});
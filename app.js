const DEBUG = true;

const db = require('./db/db_connection');
const express = require( "express" );
const logger = require("morgan");
const app = express();
const port = 3000;

// const helmet = require("helmet");
// app.use( helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", 'cdnjs.cloudflare.com']
//       }
//     }
//   })); 

const dotenv = require('dotenv');
dotenv.config();
const path = require("path");

app.set( "views",  path.join(__dirname, "views"));
app.set( "view engine", "ejs" );

// const { auth } = require('express-openid-connect');
// const { requiresAuth } = require('express-openid-connect');

// const config = {
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.AUTH0_SECRET,
//     baseURL: process.env.AUTH0_BASE_URL,
//     clientID: process.env.AUTH0_CLIENT_ID,
//     issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
//   };

// /* auth router attaches /login, /logout, and /callback routes to the baseURL */
// app.use(auth(config));

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.get( "/", ( req, res ) => {
    res.render( __dirname + "/views/index.ejs" );
} );

app.get( "/order", ( req, res ) => {
    res.render( __dirname + "/views/order.ejs" );
} );

app.get( "/about", ( req, res ) => {
    res.render( __dirname + "/views/order.ejs" );
} );

app.get( "/menu", ( req, res ) => {
    res.render( __dirname + "/views/menu.ejs" );
} );

app.get( "/menu/item_detail", ( req, res ) => {
    res.render( __dirname + "/views/item_detail.ejs" );
} );

app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );
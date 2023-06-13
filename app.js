const DEBUG = true;

const db = require('./db/db_connection');
const express = require( "express" );
const logger = require("morgan");
const app = express();
const port = 3000;

app.use(logger("dev"));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

app.get( "/", ( req, res ) => {
    res.sendFile( __dirname + "/views/index.html" );
} );

app.get( "/order", ( req, res ) => {
    res.sendFile( __dirname + "/views/order.html" );
} );

app.get( "/about", ( req, res ) => {
    res.sendFile( __dirname + "/views/about.html" );
} );

app.get( "/menu", ( req, res ) => {
    res.sendFile( __dirname + "/views/menu.html" );
} );

app.get( "/menu/item_detail", ( req, res ) => {
    res.sendFile( __dirname + "/views/item_detail.html" );
} );

app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );
const DEBUG = true;

const db = require('./db/db_connection');
const express = require("express");
const logger = require("morgan");
const app = express();
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();
const fs = require("fs");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const helmet = require("helmet");
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'cdnjs.cloudflare.com', 'https://code.jquery.com/jquery-2.1.4.min.js', 
            "https://code.jquery.com/jquery-3.5.1.min.js", "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js",
            "slick/slick.min.js", "/carousel.js"],
            styleSrc: ["'self'", 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com',
                'https://fonts.googleapis.com/css2?family=Alice&family=Parisienne&display=swap'],
            fontSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com',
                'https://fonts.googleapis.com/css2?family=Alice&family=Parisienne&display=swap']
        }
    }
}));

const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};
app.use(auth(config));

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.get('/authtest', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/about", (req, res) => {
    res.render('about');
});

const read_item_all_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "read_item_all.sql"),
                                                {encoding : "UTF-8"});

/* define a route for the menu page */
app.get( "/menu", ( req, res ) => {
    db.execute(read_item_all_sql, (error, results) => {
        if (error) {
            res.status(500).send(error); 
        } else {
            res.render("menu", {item : results});
        }
    });
});

/* define a route for the order page */
app.get("/order", requiresAuth(), (req, res) => {
    db.execute(read_item_all_sql, (error, results) => {
        if (error) {
            res.status(500).send(error); 
        } else {
            res.render("order", {item : results});
        }
    });
});

const read_item_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "read_item.sql"),
                                                {encoding : "UTF-8"});

app.get("/order/item_detail/:id", requiresAuth(), (req, res) => {
    db.execute(read_item_sql, [req.params.id], (error, results) => {
        if (error) {
            res.status(500).send(error); 
        } else {
            res.render("item_detail", {item : results});
        }
    });
});

app.get("/add_to_cart", (req, res) => {
    res.render('add_to_cart');
});

const read_order_all_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "read_order_all.sql"),
                                                {encoding : "UTF-8"});

app.get('/cart', requiresAuth(), (req, res) => {
    db.execute(read_order_all_sql, [req.oidc.user.sub], (error, results) => {
        if (error) {
            res.status(500).send(error); 
        } else {
            res.render("cart", {order : results});
        }
    });
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.render('profile', {user : req.oidc.user});
    // res.send(JSON.stringify(req.oidc.user));
});

app.listen(port, () => {
    console.log(`App server listening on ${port}. (Go to http://localhost:${port})`);
});
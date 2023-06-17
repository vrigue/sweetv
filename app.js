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
            "img-src": ["'self'", "https://lh3.googleusercontent.com"],
            scriptSrc: ["'self'", 'cdnjs.cloudflare.com', 'https://code.jquery.com/jquery-2.1.4.min.js', 
            "https://code.jquery.com/jquery-3.5.1.min.js", "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js",
                "/carousel.js", "/slick/slick.min.js"],
            styleSrc: ["'self'", 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com',
                'https://fonts.googleapis.com/css2?family=Alice&family=Parisienne&display=swap',
                "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.css",
                "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.min.css"],
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

const dateObject = new Date();
let date = dateObject.getFullYear() + "-" + 
           ("0" + (dateObject.getMonth() + 1)).slice(-2) + 
           ("0" + dateObject.getDate()).slice(-2) + " " + 
           dateObject.getHours() + ":" + 
           dateObject.getMinutes() + ":" + 
           dateObject.getSeconds();

app.use(auth(config));

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.get('/authtest', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

/* define a route for the home page */
app.get("/", (req, res) => {
    res.render('index');
});

/* define a route for the about page */
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


/* causes all route handlers below to require AUTHENTICATION*/
app.use(requiresAuth());

/* define a route for the order page */
app.get("/order", (req, res) => {
    db.execute(read_item_all_sql, (error, results) => {
        if (error) {
            res.status(500).send(error); 
        } else {
            res.render("order", {item : results});
        }
    });
});

const read_item_full_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "read_item_full.sql"),
                                                {encoding : "UTF-8"});

/* define a route for the item detail page */
app.get("/item_detail/:id", (req, res) => {
    db.execute(read_item_full_sql, [req.params.id], (error, results) => {
        if (error) {
            res.status(500).send(error); 
        } else {
            res.render("item_detail", {item : results});
        }
    });
});

const read_item_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "read_item.sql"),
                                                {encoding : "UTF-8"});

/* define a route for the add to cart page */
app.get("/add_to_cart/:id", (req, res) => {
    db.execute(read_item_sql, [req.params.id], (error, results) => {
        if (error) {
            res.status(500).send(error); 
        } else {
            res.render("add_to_cart", {item : results});
        }
    });
});

const read_order_id_null_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "read_order_id_null.sql"),
                                                {encoding : "UTF-8"});

const create_order_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "create_order.sql"),
                                                {encoding : "UTF-8"});

const create_order_item_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "create_order_item.sql"),
                                                {encoding : "UTF-8"});

/* define a route for item CREATE utilizing async and await */
app.post( "/add_to_cart/:id", async ( req, res ) => {
    try {
        let [results1, fields1] = await db.execute(read_order_id_null_sql, [req.oidc.user.sub]);
        if (results1[0] == null) {
            let [results2, fields2] = await db.execute(create_order_sql, [req.oidc.user.sub, null]);
            db.execute(create_order_item_sql, [req.params.id, results2.order_id, req.body.quantity, req.body.notes]);
        }
        else {
            db.execute(create_order_item_sql, [req.params.id, results1[0], req.body.quantity, req.body.notes]);
        }
        res.redirect(`/cart`);
    }
    catch {
        res.status(500).send(error); 
    }
});

const read_order_all_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "read_order_all.sql"),
                                                {encoding : "UTF-8"});

/* define a route for the cart page */
app.get('/cart', (req, res) => {
    db.execute(read_order_all_sql, [req.oidc.user.sub], (error, results) => {
        if (error) {
            res.status(500).send(error); 
        } else {
            res.render("cart", {order : results});
        }
    });
});

/* define a route for the edit item page */
app.get("/cart/edit/:id", (req, res) => {
    db.execute(read_item_sql, [req.params.id], (error, results) => {
        if (error) {
            res.status(500).send(error); 
        } else {
            res.render("edit", {item : results});
        }
    });
});

const update_order_item_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "update_order_item.sql"),
                                                {encoding : "UTF-8"});

/* define a route for item UPDATE utilizing async and await */
app.post("/cart/edit/:id", async (req, res) => {
    try {
        let [results, fields1] = await db.execute(read_order_id_null_sql, [req.oidc.user.sub]);
        db.execute(update_order_item_sql, [req.body.quantity, req.body.notes, req.params.id, results[0]]);
        res.redirect(`/cart`);
    }
    catch {
        res.status(500).send(error); 
    }
});

const delete_order_item_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "delete_order_item.sql"),
                                                {encoding : "UTF-8"});

/* define a route for item DELETE utilizing async and await */
app.post("/cart/delete/:id", async (req, res) => {
    try {
        let [results, fields1] = await db.execute(read_order_id_null_sql, [req.oidc.user.sub]);
        db.execute(delete_order_item_sql, [req.params.id, results[0]]);
        res.redirect(`/cart`);
    }
    catch {
        res.status(500).send(error); 
    }
});

const update_order_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "update_order.sql"),
                                                {encoding : "UTF-8"});

/* define a route for order UPDATE utilizing async and await */
app.post('/cart', async (req, res) => {
    try { 
        let [results, fields] = await db.execute(read_order_id_null_sql, [req.oidc.user.sub]);
        db.execute(update_order_sql , [date, results[0], req.oidc.user.sub]);
    }
    catch {
        res.status(500).send(error); 
    }
});

/* define a route for the profile page */
app.get('/profile', (req, res) => {
    res.render('profile', {user : req.oidc.user});
});

app.listen(port, () => {
    console.log(`App server listening on ${port}. (Go to http://localhost:${port})`);
});
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
            "img-src": ["'self'", "https://lh3.googleusercontent.com", "http://www.w3.org/2000/svg", "image/svg+xml"],
            scriptSrc: ["'self'", 'cdnjs.cloudflare.com', 'https://code.jquery.com/jquery-2.1.4.min.js', 
                "https://code.jquery.com/jquery-3.5.1.min.js", "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js",
                "/carousel.js", "/slick/slick.min.js", "path/to/dist/feather.js",
                "../feather.js", "https://unpkg.com/feather-icons", "https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"],
            styleSrc: ["'self'", 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com',
                'https://fonts.googleapis.com/css2?family=Alice&family=Parisienne&display=swap',
                "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.css",
                "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.min.css",
                "https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css"],
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
const read_item_pictures_sql = fs.readFileSync(path.join(__dirname, 
                                                "db", "queries", "crud", "read_item_pictures.sql"),
                                                {encoding : "UTF-8"});
/* define a route for the item detail page */
app.get("/item_detail/:id", (req, res) => {
    db.execute(read_item_full_sql, [req.params.id], (error, results) => {
        if (error) {
            res.status(500).send(error); 
        }
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"`); 
        else {
            db.execute(read_item_pictures_sql, [req.params.id], (error2, results2) => {
                if (error2)
                    res.status(500).send(error2);
                else {
                    res.render("item_detail", {item : results[0], picture: results2});
                }
            });
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
            res.render("add_to_cart", {item : results[0]});
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
app.post( "/add_to_cart", ( req, res ) => {
    try {
        db.execute(read_order_id_null_sql, [req.oidc.user.sub], (error, results) => {
            if (error)
                res.status(500).send(error);
            else {
                if (results.length < 1) {
                    db.execute(create_order_sql, [req.oidc.user.sub], (error2, results2) => {
                        if (error2)
                            res.status(500).send(error2);
                        else {
                            console.log(results2);
                            db.execute(create_order_item_sql, [req.body.serial, results2.insertId, req.body.quantity, req.body.notes], (error3, results3) => {
                                if (error3)
                                    res.status(500).send(error3);
                            });
                        }
                    });
                }
                else {
                    // console.log(req.body.serial)
                    // console.log(results[0].order_id)
                    // console.log(req.body.quantity)
                    // console.log(req.body.notes)
                    db.execute(create_order_item_sql, [req.body.serial, results[0].order_id, req.body.quantity, req.body.notes], (error2, results2) => {
                        if (error2)
                            res.status(500).send(error2);
                    });
                }
                res.redirect(`/cart`);
            }
        });        
    }
    catch (error) {
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
            let cost = 0
            for (let i = 0; i < results.length; i++) {
                cost += (results[i].quantity / 12) * results[i].price_dozen + (results[i].quantity % 12) * results[i].price
            }
            res.render("cart", {order : results, sum : cost});
        }
    });
});

const read_edit_item_sql = fs.readFileSync(path.join(__dirname, 
    "db", "queries", "crud", "read_item_edit.sql"),
    {encoding : "UTF-8"});

/* define a route for the edit item page */
app.get("/cart/edit/:order/:id", (req, res) => {
    db.execute(read_edit_item_sql, [req.oidc.user.sub, req.params.order, req.params.id], (error, results) => {
        if (error) {
            res.status(500).send(error); 
        } else {
            res.render("edit", {item : results[0], num : req.params.order, serial: req.params.id});
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
    catch (error) {
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
    catch (error) {
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
    catch (error) {
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
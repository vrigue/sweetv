const db = require("./db_connection");

/**** CLEANUP ****/
db.execute("DROP TABLE IF EXISTS `item_pic_xref`;");
db.execute("DROP TABLE IF EXISTS `order_item_xref`;");
db.execute("DROP TABLE IF EXISTS `orders`;");
db.execute("DROP TABLE IF EXISTS `item`;");
db.execute("DROP TABLE IF EXISTS `picture`;");
// db.execute("DROP TABLE IF EXISTS `user`;");

/**** TABLES  ****/

// USER
// db.execute(`
//     CREATE TABLE user (
//         user_id INT NOT NULL AUTO_INCREMENT,
//         first_name VARCHAR(45) NULL,
//         last_name VARCHAR(45) NULL,
//         email VARCHAR(45) NOT NULL,
//         PRIMARY KEY (user_id))
//     COMMENT = 'table for both admins and customers.';
// `);

// const insert_users = `
//     INSERT INTO user 
//         (first_name, last_name, email)
//     VALUES 
//         (?, ?, ?);
// `
// db.execute(insert_users, ['Kimberley', 'Ni', 'kimni25@bergen.org']);
// db.execute(insert_users, ['Vrielle', 'Guevarra', 'vrigue25@bergen.org']);
// db.execute(insert_users, ['Kristina', 'Nguyen', 'kringu25@bergen.org']);

// db.execute("SELECT * FROM user",
//     (error, results) => {
//         if (error)
//         throw error;

//         console.log("Table 'user' initialized with:")
//         console.log(results);
//     }
// );

// ITEM
db.execute(`
    CREATE TABLE item (
        item_id INT NOT NULL AUTO_INCREMENT,
        item_name VARCHAR(150) NULL,
        ingredients VARCHAR(150) NULL,
        allergens VARCHAR(150) NULL,
        description VARCHAR(450) NULL,
        price DOUBLE NOT NULL,
        price_dozen DOUBLE NULL,
        PRIMARY KEY (item_id)
    );
`);

const insert_items = `
    INSERT INTO item 
        (item_name, ingredients, allergens, description, price, price_dozen)
    VALUES 
        (?, ?, ?, ?, ?, ?);
`
db.execute(insert_items, ['Ube Macapuno Cookies', 'Ube (mashed), flour, sugar, butter, macapuno,',
    'Milk, Wheat', 'Overall, a very yummy (and more importantly purple).', '4.75', '25']);
db.execute(insert_items, ['Chocolate Chip Cookies', 'Flour, sugar, butter, dark chocolate, milk',
    'Milk, Wheat', 'Your basic chocolate chip cookie.', '4.50', '25']);
db.execute(insert_items, ['Matcha White Chocolate Chip Cookies', 'Matcha powder, white chocolate, wheat, flour,',
    'Milk, Wheat', 'A great green cookie! Made with the finest ceremonial grade matcha powder.', '4.75', '25']);
db.execute(insert_items, ['Oatmeal Strawberry Cookies', 'Oatmeal, strawberry, butter, wheat',
    'Milk, Wheat', 'A comfort choice.', '4.75', '25']);

db.execute("SELECT * FROM item",
    (error, results) => {
        if (error)
        throw error;

        console.log("Table 'item' initialized with:")
        console.log(results);
    }
);

// PICTURE
db.execute(`
    CREATE TABLE picture (
        picture_id INT NOT NULL AUTO_INCREMENT,
        address VARCHAR(150) NULL,
        alt VARCHAR(150) NULL,
        PRIMARY KEY (picture_id)
    );
`);

const insert_pics = `
    INSERT INTO picture 
        (address, alt)
    VALUES 
        (?, ?);
`
db.execute(insert_pics, ['/images/ube.png', 'ube']);
db.execute(insert_pics, ['/images/chocolate_chip.png', 'chocolate chip']);
db.execute(insert_pics, ['/images/matcha.png', 'matcha white chocolate chip cookies']);
db.execute(insert_pics, ['/images/strawberry.png', 'oatmeal strawberry cookies']);

db.execute("SELECT * FROM picture",
    (error, results) => {
        if (error)
        throw error;

        console.log("Table 'picture' initialized with:")
        console.log(results);
    }
);

// ITEM PIC XREF
db.execute(`
    CREATE TABLE item_pic_xref (
        item_id INT NOT NULL,
        picture_id INT NOT NULL,
        slide_order INT NULL,
        PRIMARY KEY (item_id, picture_id),
        INDEX pic_id_idx (picture_id ASC),
        CONSTRAINT item_id
        FOREIGN KEY (item_id)
        REFERENCES item (item_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
        CONSTRAINT picture_id
        FOREIGN KEY (picture_id)
        REFERENCES picture (picture_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE)
    COMMENT = 'A cross reference tables for Items and Pictures, with slide_order to determine the placement of the picture on the product details (or add to cart) page.';
`);

const item_pic_connect = `
    INSERT INTO item_pic_xref 
        (item_id, picture_id, slide_order)
    VALUES 
        (?, ?, ?);
`
db.execute(item_pic_connect, ['1', '1', '3']);
db.execute(item_pic_connect, ['2', '2', '2']);
db.execute(item_pic_connect, ['3', '3', '1']);
db.execute(item_pic_connect, ['4', '4', '4']);

db.execute("SELECT * FROM item_pic_xref",
    (error, results) => {
        if (error)
        throw error;

        console.log("Table 'item_pic_xref' initialized with:")
        console.log(results);
    }
);

// ORDER
db.execute(`
    CREATE TABLE orders (
        order_id INT NOT NULL AUTO_INCREMENT,
        user_id VARCHAR(50) NOT NULL,
        date DATETIME NULL,
        PRIMARY KEY (order_id)
    );
`);

const insert_orders = `
    INSERT INTO orders
        (user_id, date)
    VALUES 
        (?, ?);
`
// db.execute(insert_orders, ['1', '2023-05-26 12:01:00']); 
// db.execute(insert_orders, ['4', '2023-05-26 12:01:00']);
// db.execute(insert_orders, ['4', '2023-05-26 13:58:30']);
// db.execute(insert_orders, ['4', null]);
// db.execute(insert_orders, ['3', '2023-05-25 18:43:57']);

db.execute(insert_orders, ['google-oauth2|111073053384468725735', '2023-05-26 12:01:00']); 
db.execute(insert_orders, ['google-oauth2|111073053384468725735', null]);
db.execute(insert_orders, ['google-oauth2|115571894687720236883', null]); 

db.execute("SELECT * FROM orders",
    (error, results) => {
        if (error)
        throw error;

        console.log("Table 'order' initialized with:")
        console.log(results);
    }
);

// ORDER ITEM XREF
db.execute(`
    CREATE TABLE order_item_xref (
        item_id INT NOT NULL,
        order_id INT NOT NULL,
        quantity INT NOT NULL,
        notes VARCHAR(500) NULL,
        PRIMARY KEY (item_id, order_id),
        INDEX order_order_idx (order_id ASC),
        CONSTRAINT order_item
        FOREIGN KEY (item_id)
        REFERENCES item (item_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
        CONSTRAINT order_order
        FOREIGN KEY (order_id)
        REFERENCES orders (order_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
    );
`);

const order_item_connect = `
    INSERT INTO order_item_xref 
        (item_id, order_id, quantity, notes)
    VALUES 
        (?, ?, ?, ?);
`
// // placed (has date) order #1 for kimby
// db.execute(order_item_connect, ['1', '1', '1']);
// db.execute(order_item_connect, ['2', '1', '1']);

// // placed (has date) order #5 for pyro
// db.execute(order_item_connect, ['3', '5', '12']);

// placed (has date) order #1 for vri
db.execute(order_item_connect, ['1', '1', '24', null]);
db.execute(order_item_connect, ['4', '1', '2', null]);

// unplaced (no date) order #2 for vri 
// db.execute(order_item_connect, ['1', '2', '36']);
db.execute(order_item_connect, ['2', '2', '24', 'Add extra chocolate chips.']);
db.execute(order_item_connect, ['3', '2', '5', null]);
db.execute(order_item_connect, ['4', '2', '12', null]);

db.execute("SELECT * FROM order_item_xref",
    (error, results) => {
        if (error)
        throw error;

        console.log("Table 'order_item_xref' initialized with:")
        console.log(results);
    }
);

db.end();
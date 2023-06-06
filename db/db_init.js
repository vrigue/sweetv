const db = require("./db_connection");

/**** CLEANUP ****/
db.execute("DROP TABLE IF EXISTS `item_pic_xref`;");
db.execute("DROP TABLE IF EXISTS `order_item_xref`;");
db.execute("DROP TABLE IF EXISTS `order`;");
db.execute("DROP TABLE IF EXISTS `item`;");
db.execute("DROP TABLE IF EXISTS `picture`;");
db.execute("DROP TABLE IF EXISTS `user`;");

/**** TABLES  ****/

db.execute(`
    CREATE TABLE user (
        user_id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(45) NULL,
        last_name VARCHAR(45) NULL,
        email VARCHAR(45) NOT NULL,
        PRIMARY KEY (user_id))
    COMMENT = 'table for both admins and customers;
`);

db.execute(`
    CREATE TABLE countries (
        picture_id INT NOT NULL AUTO_INCREMENT,
        address VARCHAR(45) NULL,
        alt VARCHAR(45) NULL,
        PRIMARY KEY (picture_id)
    );
`);

// const insert_countries_table_sql = `
//     INSERT INTO countries 
//         (country_name)
//     VALUES 
//         (?);
// `
// db.execute(insert_countries_table_sql, ['England']);

// CREATE TABLE `project_kimni25_vrigue25_p8_2223t11`.`item` (
//     `item_id` INT NOT NULL AUTO_INCREMENT,
//     `ingredients` VARCHAR(45) NULL,
//     `allergens` VARCHAR(45) NULL,
//     `desc` VARCHAR(45) NULL,
//     PRIMARY KEY (`item_id`));

// CREATE TABLE `project_kimni25_vrigue25_p8_2223t11`.`picture` (
//     `picture_id` INT NOT NULL AUTO_INCREMENT,
//     `address` VARCHAR(45) NULL,
//     `alt` VARCHAR(45) NULL,
//     PRIMARY KEY (`picture_id`));

// CREATE TABLE `project_kimni25_vrigue25_p8_2223t11`.`item_pic_xref` (
//     `item_id` INT NOT NULL,
//     `picture_id` INT NOT NULL,
//     `slide_order` INT NULL,
//     PRIMARY KEY (`item_id`, `picture_id`),
//     INDEX `pic_id_idx` (`picture_id` ASC),
//     CONSTRAINT `item_id`
//       FOREIGN KEY (`item_id`)
//       REFERENCES `project_kimni25_vrigue25_p8_2223t11`.`item` (`item_id`)
//       ON DELETE RESTRICT
//       ON UPDATE CASCADE,
//     CONSTRAINT `picture_id`
//       FOREIGN KEY (`picture_id`)
//       REFERENCES `project_kimni25_vrigue25_p8_2223t11`.`picture` (`picture_id`)
//       ON DELETE RESTRICT
//       ON UPDATE CASCADE)
//   COMMENT = 'A cross reference tables for Items and Pictures, with \'slide_order\' to determine the placement of the picture on the product details (or add to cart) page.';

// CREATE TABLE `project_kimni25_vrigue25_p8_2223t11`.`order` (
//     `order_id` INT NOT NULL,
//     `item_id` INT NOT NULL,
//     `user_id` INT NOT NULL,
//     `quantity` INT NOT NULL,
//     `date` DATETIME NOT NULL,
//     PRIMARY KEY (`order_id`),
//     INDEX `item_id_idx` (`item_id` ASC),
//     INDEX `user_id_idx` (`user_id` ASC),
//     CONSTRAINT `order_item_id`
//       FOREIGN KEY (`item_id`)
//       REFERENCES `project_kimni25_vrigue25_p8_2223t11`.`item` (`item_id`)
//       ON DELETE RESTRICT
//       ON UPDATE CASCADE,
//     CONSTRAINT `order_user_id`
//       FOREIGN KEY (`user_id`)
//       REFERENCES `project_kimni25_vrigue25_p8_2223t11`.`user` (`user_id`)
//       ON DELETE RESTRICT
//       ON UPDATE CASCADE);
  

// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`item` (`name`, `ingredients`, `allergens`, `desc`, `price`, `price_dozen`) VALUES ('Ube Macapuno Cookies', 'Ube (mashed), flour, sugar, butter, macapuno, eggs, baking powder, baking soda, salt, ube extract', 'Milk, Wheat', 'Overall, a very yummy (and more importantly purple) cookie.', '4.75', '25.00');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`item` (`name`, `ingredients`, `allergens`, `desc`, `price`, `price_dozen`) VALUES ('Chocolate Chip Cookies', 'Flour, sugar, butter, dark chocolate, milk', 'Milk, Wheat', 'Your basic chocolate chip cookie.', '4.75', '25.00');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`item` (`name`, `ingredients`, `allergens`, `desc`, `price`, `price_dozen`) VALUES ('Matcha White Chocolate Chip Cookies', 'Matcha powder, white chocolate, wheat, flour, sugar, butter,', 'Milk, Wheat', 'A great green cookie! Made with the finest ceremonial matcha powde.', '4.50', '25.00');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`item` (`name`, `ingredients`, `allergens`, `desc`, `price`, `price_dozen`) VALUES ('Oatmeal Strawberry Cookies', 'Oatmeal, strawberry, butter, wheat', 'Milk, Wheat', 'A comfort choice.', '4.50', '25.00');

// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`picture` (`address`, `alt`) VALUES ('..\\images\\ube.png', 'ube');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`picture` (`address`, `alt`) VALUES ('..\\images\\chocolate_chip.png', 'chocolate chip');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`picture` (`address`, `alt`) VALUES ('..\\images\\matcha.png', 'matcha white chocolate chip cookies');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`picture` (`address`, `alt`) VALUES ('..\\images\\strawberry.png', 'oatmeal strawberry cookies');

// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`user` (`first_name`, `last_name`, `email`) VALUES ('Kimberley', 'Ni', 'kimni25@bergen.org');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`user` (`first_name`, `last_name`, `email`) VALUES ('Vrielle', 'Guevarra', 'vrigue25@bergen.org');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`user` (`first_name`, `last_name`, `email`) VALUES ('Kristina', 'Nguyen', 'kringu25@bergen.org');

// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`item_pic_xref` (`item_id`, `picture_id`, `slide_order`) VALUES ('1', '1', '1');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`item_pic_xref` (`item_id`, `picture_id`, `slide_order`) VALUES ('2', '2', '1');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`item_pic_xref` (`item_id`, `picture_id`, `slide_order`) VALUES ('3', '3', '1');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`item_pic_xref` (`item_id`, `picture_id`, `slide_order`) VALUES ('4', '4', '1');

// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`order` (`item_id`, `user_id`, `quantity`, `date`) VALUES ('1', '1', '3', '2023-05-26 12:01:00');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`order` (`item_id`, `user_id`, `quantity`, `date`) VALUES ('3', '1', '2', '2023-05-26 12:01:00');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`order` (`item_id`, `user_id`, `quantity`, `date`) VALUES ('2', '3', '1', '2023-05-26 13:58:30');
// INSERT INTO `project_kimni25_vrigue25_p8_2223t11`.`order` (`item_id`, `user_id`, `quantity`, `date`) VALUES ('2', '3', '12', '2023-05-25-18:43:57');

// CREATE TABLE `project_kimni25_vrigue25_p8_2223t11`.`order_item_xref` (
//     `item_id` INT NOT NULL,
//     `order_id` INT NOT NULL,
//     `quantity` INT NOT NULL,
//     PRIMARY KEY (`item_id`, `order_id`),
//     INDEX `order_order_idx` (`order_id` ASC),
//     CONSTRAINT `order_item`
//       FOREIGN KEY (`item_id`)
//       REFERENCES `project_kimni25_vrigue25_p8_2223t11`.`item` (`item_id`)
//       ON DELETE RESTRICT
//       ON UPDATE CASCADE,
//     CONSTRAINT `order_order`
//       FOREIGN KEY (`order_id`)
//       REFERENCES `project_kimni25_vrigue25_p8_2223t11`.`order` (`order_id`)
//       ON DELETE RESTRICT
//       ON UPDATE CASCADE);
  
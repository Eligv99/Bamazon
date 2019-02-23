DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
--   * item_id (unique id for each product)
    item_id INT AUTO_INCREMENT NOT NULL,
--   * product_name (Name of product)
    product_name VARCHAR(100) NOT NULL,
--   * department_name
    department_name VARCHAR(100) NOT NULL,
--   * price (cost to customer)
    price DECIMAL(10, 2) NOT NULL,
--   * stock_quantity (how much of the product is available in stores)
    stock_quantity INT NOT NULL,
--   PRIMARY KEY 
    PRIMARY KEY(item_id)
);


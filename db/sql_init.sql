CREATE DATABASE IF NOT EXISTS gpus;

CREATE TABLE IF NOT EXISTS gpus.products (
  id int PRIMARY KEY AUTO_INCREMENT,
  shop varchar(30),
  product varchar(255),
  price varchar(30),
  available boolean,
  product_url text
);

SELECT
  'Database successfully created!' AS '';


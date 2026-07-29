CREATE DATABASE taxpal;
USE taxpal;
CREATE TABLE users (
   id int NOT NULL AUTO_INCREMENT,
   name varchar(100) NOT NULL,
   email varchar(100) NOT NULL,
   password varchar(255) NOT NULL,
   country varchar(100) NOT NULL,
   income_bracket varchar(50) DEFAULT NULL,
   PRIMARY KEY (id),
   UNIQUE KEY email (email)
 ) 
CREATE TABLE Transactions( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type varchar(10) NOT NULL CHECK(type IN('income','expense')) ,
    category varchar(50) NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK(amount>=0),
    date DATE not null,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
   
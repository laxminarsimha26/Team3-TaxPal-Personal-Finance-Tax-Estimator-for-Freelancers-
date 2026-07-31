CREATE DATABASE taxpal;
USE taxpal;

CREATE TABLE users (
   id INT NOT NULL AUTO_INCREMENT,
   name VARCHAR(100) NOT NULL,
   email VARCHAR(100) NOT NULL,
   password VARCHAR(255) NOT NULL,
   country VARCHAR(100) NOT NULL,
   income_bracket VARCHAR(50) DEFAULT NULL,
   PRIMARY KEY (id),
   UNIQUE KEY email (email)
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income','expense')),
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

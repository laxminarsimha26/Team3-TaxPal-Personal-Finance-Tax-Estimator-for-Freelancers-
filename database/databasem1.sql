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
    type varchar(10) NOT NULL CHECK(type IN('income','expense')) ,
    category varchar(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK(amount>=0),
    date DATE not null,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
   
>>>>>>> 36d969f (added users and transactions tables)


-- 3. BUDGETS TABLE
CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    budget_amount DECIMAL(10,2) NOT NULL,
    month VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- 4. SUGGESTED CATEGORIES TABLE
CREATE TABLE suggested_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    description VARCHAR(255)
);


-- 5. TAX ESTIMATES TABLE
CREATE TABLE tax_estimates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    country VARCHAR(100) NOT NULL,
    quarter VARCHAR(10) NOT NULL,
    estimated_tax DECIMAL(10,2) NOT NULL,
    due_date DATE,
    state VARCHAR(100),
    filing_status VARCHAR(50),
    gross_income_for_quarter DECIMAL(12,2),
    business_expenses DECIMAL(12,2),
    retirement_contribution DECIMAL(12,2),
    health_insurance_premiums DECIMAL(12,2),
    home_office_deduction DECIMAL(12,2),
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- 6. ALERTS TABLE
CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    message VARCHAR(255) NOT NULL,
    alert_date DATE NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- 7. REPORTS TABLE
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    period VARCHAR(50) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(255),
    format VARCHAR(20),
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
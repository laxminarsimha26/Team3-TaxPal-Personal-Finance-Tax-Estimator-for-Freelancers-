# Backend Setup

## Prerequisites

Before running the backend, make sure you have:

- Node.js (v18 or later)
- MySQL Server
- MySQL Workbench (or any MySQL client)

---

## 1. Navigate to the Backend Folder

```bash
cd backend
```

---

## 2. Install Dependencies

```bash
npm install
```

This installs all required packages listed in `package.json`.

---

## 3. Configure Environment Variables

Create a `.env` file inside the `backend` folder and add:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=taxpal

SESSION_SECRET=taxpal_secret_key
```

Replace `your_mysql_password` with your local MySQL password.

---

---

## 4. Create the Database (MySQL CLI)

Open the **MySQL Command Line Client** and log in:

```bash
mysql -u root -p
```

Enter your MySQL password when prompted.

Import the SQL file:

```sql
SOURCE path/to/database/databasem1.sql;
```

**Example (Windows):**

```sql
SOURCE C:/Users/YourName/Desktop/Team3-TaxPal-Personal-Finance-Tax-Estimator-for-Freelancers/database/databasem1.sql;
```

Verify that the database was created successfully:

```sql
SHOW DATABASES;
USE taxpal;
SHOW TABLES;
```

You should see the following tables:

```
users
transactions
```

Type the following to exit the MySQL CLI:

```sql
EXIT;
```

---

## 5. Start the Backend Server

Run:

```bash
node server.js
```

If the server starts successfully, you should see:

```
MySQL Connected
Server running on port 5000
```

The backend will run at:

```
http://localhost:5000
```

---

## Backend Folder Structure

```
backend/
│
├── server.js                  # Starts the Express server
├── package.json               # Project dependencies
├── .env                       # Environment variables
│
├── config/
│   └── db.js                  # MySQL database connection
│
├── routes/
│   └── authRoutes.js          # Authentication routes
│
├── controllers/
│   └── authController.js      # Authentication logic
│
├── models/
│   └── userModel.js           # Database queries
│
└── middleware/
    └── authMiddleware.js      # Session authentication middleware
```

---

## Available API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login an existing user |
| POST | `/api/auth/logout` | Logout the current user |
| GET | `/api/auth/me` | Get the logged-in user's session |

---

## Authentication

- Passwords are securely hashed using **bcrypt**.
- User authentication is managed using **Express Session**.
- User data is stored in **MySQL**.
- Sessions are maintained using HTTP cookies.
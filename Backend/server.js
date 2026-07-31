require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
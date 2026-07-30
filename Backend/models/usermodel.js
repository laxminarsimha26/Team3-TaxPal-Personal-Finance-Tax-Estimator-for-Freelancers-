const db = require("../config/db");

exports.findUserByEmail = (email, callback) => {

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        callback
    );

};

exports.createUser = (user, callback) => {

    db.query(

        `INSERT INTO users
        (name,email,password,country,income_bracket)
        VALUES(?,?,?,?,?)`,

        [
            user.name,
            user.email,
            user.password,
            user.country,
            user.income_bracket
        ],

        callback

    );

};
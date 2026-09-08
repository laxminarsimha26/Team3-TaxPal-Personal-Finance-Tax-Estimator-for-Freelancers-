const bcrypt = require("bcrypt");

const userModel = require("../models/userModel");

exports.signup = (req, res) => {
    const { name, email, password, country } = req.body;

    userModel.findUserByEmail(email, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json(err);
            }

            userModel.createUser({
                name,
                email,
                password: hash,
                country,
                income_bracket: null
            }, (err) => {
                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    success: true,
                    message: "Account Created"
                });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    userModel.findUserByEmail(email, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Login failed"
                });
            }

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Password"
                });
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                country: user.country,
                income_bracket: user.income_bracket
            };

            res.json({
                success: true,
                message: "Login Successful",
                user: req.session.user
            });
        });
    });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.json({
            success: true,
            message: "Logged out"
        });
    });
};

exports.me = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not logged in"
        });
    }

    res.json({
        success: true,
        user: req.session.user
    });
};
const transactionModel = require("../models/transactionModel");

exports.getTransactions = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    transactionModel.getByUserId(req.session.user.id, (err, results) => {
        if (err) {
            console.error("Get transactions error:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch transactions"
            });
        }

        const transactions = results.map(t => ({
            id: String(t.id),
            userId: String(t.user_id),
            type: t.type,
            category: t.category,
            amount: Number(t.amount),
            date: t.date instanceof Date
                ? t.date.toISOString().split("T")[0]
                : String(t.date).slice(0, 10)
        }));

        res.json({
            success: true,
            transactions
        });
    });
};

exports.createTransaction = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const { type, category, amount, date } = req.body;

    if (
        !["income", "expense"].includes(type) ||
        !category ||
        amount === undefined ||
        Number(amount) < 0 ||
        !date
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid transaction data"
        });
    }

    transactionModel.create(
        {
            userId: req.session.user.id,
            type,
            category,
            amount: Number(amount),
            date
        },
        (err, result) => {
            if (err) {
                console.error("Create transaction error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to create transaction"
                });
            }

            res.status(201).json({
                success: true,
                transaction: {
                    id: String(result.insertId),
                    userId: String(req.session.user.id),
                    type,
                    category,
                    amount: Number(amount),
                    date
                }
            });
        }
    );
};

exports.deleteTransaction = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    transactionModel.delete(
        req.params.id,
        req.session.user.id,
        (err, result) => {
            if (err) {
                console.error("Delete transaction error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete transaction"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Transaction not found"
                });
            }

            res.json({
                success: true,
                message: "Transaction deleted"
            });
        }
    );
};

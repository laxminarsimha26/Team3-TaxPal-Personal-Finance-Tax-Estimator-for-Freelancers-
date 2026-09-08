const db = require("../config/db");

exports.getByUserId = (userId, callback) => {
    db.query(
        "SELECT id, user_id, type, category, amount, date FROM transactions WHERE user_id = ? ORDER BY date DESC, id DESC",
        [userId],
        callback
    );
};

exports.create = (transaction, callback) => {
    db.query(
        `INSERT INTO transactions
        (user_id, type, category, amount, date)
        VALUES (?, ?, ?, ?, ?)`,
        [
            transaction.userId,
            transaction.type,
            transaction.category,
            transaction.amount,
            transaction.date
        ],
        callback
    );
};

exports.delete = (id, userId, callback) => {
    db.query(
        "DELETE FROM transactions WHERE id = ? AND user_id = ?",
        [id, userId],
        callback
    );
};

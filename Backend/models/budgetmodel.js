const db = require("../config/db");

exports.createBudget = (budget, callback) => {
    db.query(
        `INSERT INTO budgets
        (user_id, category, \`limit\`, month)
        VALUES (?, ?, ?, ?)`,
        [
            budget.user_id,
            budget.category,
            budget.limit,
            `${budget.month}-01`
        ],
        callback
    );
};

exports.getBudgetsByUser = (userId, callback) => {
    db.query(
        `SELECT
            id,
            user_id,
            category,
            \`limit\`,
            DATE_FORMAT(month, '%Y-%m') AS month
        FROM budgets
        WHERE user_id = ?
        ORDER BY month DESC, id DESC`,
        [userId],
        callback
    );
};

exports.updateBudget = (id, userId, budget, callback) => {
    db.query(
        `UPDATE budgets
        SET category = ?, \`limit\` = ?, month = ?
        WHERE id = ? AND user_id = ?`,
        [
            budget.category,
            budget.limit,
            `${budget.month}-01`,
            id,
            userId
        ],
        callback
    );
};

exports.deleteBudget = (id, userId, callback) => {
    db.query(
        `DELETE FROM budgets
        WHERE id = ? AND user_id = ?`,
        [id, userId],
        callback
    );
};
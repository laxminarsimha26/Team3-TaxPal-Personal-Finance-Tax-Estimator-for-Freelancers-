const db = require("../config/db");

exports.createReport = (report, callback) => {
    db.query(
        `INSERT INTO reports
        (user_id, period, report_type, file_path, format)
        VALUES (?, ?, ?, ?, ?)`,
        [
            report.user_id,
            report.period,
            report.report_type,
            report.file_path || null,
            report.format || null
        ],
        callback
    );
};

exports.getReportsByUser = (userId, callback) => {
    db.query(
        `SELECT
            id,
            user_id,
            period,
            report_type,
            file_path,
            format
        FROM reports
        WHERE user_id = ?
        ORDER BY id DESC`,
        [userId],
        callback
    );
};

exports.getReport = (id, userId, callback) => {
    db.query(
        `SELECT
            id,
            user_id,
            period,
            report_type,
            file_path,
            format
        FROM reports
        WHERE id = ? AND user_id = ?`,
        [id, userId],
        callback
    );
};

exports.deleteReport = (id, userId, callback) => {
    db.query(
        `DELETE FROM reports
        WHERE id = ? AND user_id = ?`,
        [id, userId],
        callback
    );
};

exports.getSummary = (userId, startDate, endDate, callback) => {
    const query = `
        SELECT
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS totalIncome,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS totalExpense,
            COUNT(*) AS transactionCount
        FROM transactions
        WHERE user_id = ?
        AND date BETWEEN ? AND ?
    `;

    db.query(query, [userId, startDate, endDate], callback);
};

exports.getCategoryBreakdown = (userId, startDate, endDate, callback) => {
    const query = `
        SELECT
            category,
            type,
            COALESCE(SUM(amount), 0) AS amount
        FROM transactions
        WHERE user_id = ?
        AND date BETWEEN ? AND ?
        GROUP BY category, type
        ORDER BY amount DESC
    `;

    db.query(query, [userId, startDate, endDate], callback);
};

exports.getMonthlyBreakdown = (userId, year, callback) => {
    const query = `
        SELECT
            DATE_FORMAT(date, '%Y-%m') AS month,
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
            COUNT(*) AS transactionCount
        FROM transactions
        WHERE user_id = ?
        AND YEAR(date) = ?
        GROUP BY DATE_FORMAT(date, '%Y-%m')
        ORDER BY month
    `;

    db.query(query, [userId, year], callback);
};

exports.getQuarterlyBreakdown = (userId, year, callback) => {
    const query = `
        SELECT
            QUARTER(date) AS quarterNumber,
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense,
            COUNT(*) AS transactionCount
        FROM transactions
        WHERE user_id = ?
        AND YEAR(date) = ?
        GROUP BY QUARTER(date)
        ORDER BY QUARTER(date)
    `;

    db.query(query, [userId, year], callback);
};

exports.getTransactionsForExport = (userId, startDate, endDate, callback) => {
    const query = `
        SELECT
            date,
            type,
            category,
            amount
        FROM transactions
        WHERE user_id = ?
        AND date BETWEEN ? AND ?
        ORDER BY date
    `;

    db.query(query, [userId, startDate, endDate], callback);
};
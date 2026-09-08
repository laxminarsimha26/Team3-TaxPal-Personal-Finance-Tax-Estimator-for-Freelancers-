const db = require("../config/db");

exports.createTaxEstimate = (tax, callback) => {
    db.query(
        `INSERT INTO tax_estimates
        (
            user_id,
            country,
            quarter,
            year,
            estimated_tax,
            due_date,
            state,
            filing_status,
            gross_income_for_quarter,
            business_expenses,
            retirement_contribution,
            health_insurance_premiums,
            home_office_deduction
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            tax.user_id,
            tax.country,
            tax.quarter,
            tax.year,
            tax.estimated_tax,
            tax.due_date,
            tax.state,
            tax.filing_status,
            tax.gross_income_for_quarter,
            tax.business_expenses,
            tax.retirement_contribution,
            tax.health_insurance_premiums,
            tax.home_office_deduction
        ],
        callback
    );
};

exports.getTaxEstimatesByUser = (userId, callback) => {
    db.query(
        `SELECT
            id,
            user_id,
            country,
            quarter,
            year,
            estimated_tax,
            due_date,
            state,
            filing_status,
            gross_income_for_quarter,
            business_expenses,
            retirement_contribution,
            health_insurance_premiums,
            home_office_deduction
        FROM tax_estimates
        WHERE user_id = ?
        ORDER BY year DESC, id DESC`,
        [userId],
        callback
    );
};

exports.getTaxEstimate = (id, userId, callback) => {
    db.query(
        `SELECT
            id,
            user_id,
            country,
            quarter,
            year,
            estimated_tax,
            due_date,
            state,
            filing_status,
            gross_income_for_quarter,
            business_expenses,
            retirement_contribution,
            health_insurance_premiums,
            home_office_deduction
        FROM tax_estimates
        WHERE id = ? AND user_id = ?`,
        [id, userId],
        callback
    );
};

exports.updateTaxEstimate = (
    id,
    userId,
    tax,
    callback
) => {
    db.query(
        `UPDATE tax_estimates
        SET
            country = ?,
            quarter = ?,
            year = ?,
            estimated_tax = ?,
            due_date = ?,
            state = ?,
            filing_status = ?,
            gross_income_for_quarter = ?,
            business_expenses = ?,
            retirement_contribution = ?,
            health_insurance_premiums = ?,
            home_office_deduction = ?
        WHERE id = ? AND user_id = ?`,
        [
            tax.country,
            tax.quarter,
            tax.year,
            tax.estimated_tax,
            tax.due_date,
            tax.state,
            tax.filing_status,
            tax.gross_income_for_quarter,
            tax.business_expenses,
            tax.retirement_contribution,
            tax.health_insurance_premiums,
            tax.home_office_deduction,
            id,
            userId
        ],
        callback
    );
};

exports.deleteTaxEstimate = (
    id,
    userId,
    callback
) => {
    db.query(
        `DELETE FROM tax_estimates
        WHERE id = ? AND user_id = ?`,
        [id, userId],
        callback
    );
};
const budgetModel = require("../models/budgetmodel");

exports.createBudget = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const { category, limit, month } = req.body;

    if (!category || limit === undefined || Number(limit) <= 0 || !month) {
        return res.status(400).json({
            success: false,
            message: "Invalid budget data"
        });
    }

    const databaseMonth = `${month}-01`;

    budgetModel.createBudget(
        {
            user_id: req.session.user.id,
            category,
            limit: Number(limit),
            month: databaseMonth
        },
        (err, result) => {
            if (err) {
                console.error("Create budget error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create budget"
                });
            }

            res.status(201).json({
                success: true,
                message: "Budget created successfully",
                budget: {
                    id: String(result.insertId),
                    userId: String(req.session.user.id),
                    category,
                    limit: Number(limit),
                    month
                }
            });
        }
    );
};

exports.getBudgets = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    budgetModel.getBudgetsByUser(
        req.session.user.id,
        (err, results) => {
            if (err) {
                console.error("Get budgets error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch budgets"
                });
            }

            const budgets = results.map(budget => ({
                id: String(budget.id),
                userId: String(budget.user_id),
                category: budget.category,
                limit: Number(budget.limit),
                month: String(budget.month).slice(0, 7)
            }));

            res.json({
                success: true,
                budgets
            });
        }
    );
};

exports.updateBudget = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const budgetId = req.params.id;
    const { category, limit, month } = req.body;

    if (!category || limit === undefined || Number(limit) <= 0 || !month) {
        return res.status(400).json({
            success: false,
            message: "Invalid budget data"
        });
    }

    const databaseMonth = `${month}-01`;

    budgetModel.updateBudget(
        budgetId,
        req.session.user.id,
        {
            category,
            limit: Number(limit),
            month: databaseMonth
        },
        (err, result) => {
            if (err) {
                console.error("Update budget error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update budget"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Budget not found"
                });
            }

            res.json({
                success: true,
                message: "Budget updated successfully",
                budget: {
                    id: String(budgetId),
                    userId: String(req.session.user.id),
                    category,
                    limit: Number(limit),
                    month
                }
            });
        }
    );
};

exports.deleteBudget = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    budgetModel.deleteBudget(
        req.params.id,
        req.session.user.id,
        (err, result) => {
            if (err) {
                console.error("Delete budget error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete budget"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Budget not found"
                });
            }

            res.json({
                success: true,
                message: "Budget deleted successfully"
            });
        }
    );
};
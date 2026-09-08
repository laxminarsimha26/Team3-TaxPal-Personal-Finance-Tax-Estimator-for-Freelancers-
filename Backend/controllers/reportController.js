const reportModel = require("../models/reportModel");

exports.createReport = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const report = {
        user_id: req.session.user.id,
        period: req.body.period,
        report_type: req.body.report_type,
        file_path: req.body.file_path || null,
        format: req.body.format || null
    };

    if (!report.period || !report.report_type) {
        return res.status(400).json({
            success: false,
            message: "Period and report type are required"
        });
    }

    reportModel.createReport(report, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to create report"
            });
        }

        res.status(201).json({
            success: true,
            message: "Report created successfully",
            reportId: result.insertId
        });
    });
};

exports.getReports = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    reportModel.getReportsByUser(req.session.user.id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch reports"
            });
        }

        res.json({
            success: true,
            reports: results
        });
    });
};

exports.getReport = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    reportModel.getReport(
        req.params.id,
        req.session.user.id,
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch report"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Report not found"
                });
            }

            res.json({
                success: true,
                report: results[0]
            });
        }
    );
};

exports.deleteReport = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    reportModel.deleteReport(
        req.params.id,
        req.session.user.id,
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete report"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Report not found"
                });
            }

            res.json({
                success: true,
                message: "Report deleted successfully"
            });
        }
    );
};

exports.getSummary = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message: "startDate and endDate are required"
        });
    }

    reportModel.getSummary(
        req.session.user.id,
        startDate,
        endDate,
        (err, summaryResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to generate summary"
                });
            }

            reportModel.getCategoryBreakdown(
                req.session.user.id,
                startDate,
                endDate,
                (categoryErr, categoryResults) => {
                    if (categoryErr) {
                        console.error(categoryErr);
                        return res.status(500).json({
                            success: false,
                            message: "Failed to generate category breakdown"
                        });
                    }

                    const summary = summaryResults[0];

                    const totalIncome = Number(summary.totalIncome);
                    const totalExpense = Number(summary.totalExpense);

                    res.json({
                        success: true,
                        summary: {
                            totalIncome,
                            totalExpense,
                            netSavings: totalIncome - totalExpense,
                            transactionCount: Number(summary.transactionCount),
                            byCategory: categoryResults.map(item => ({
                                category: item.category,
                                type: item.type,
                                amount: Number(item.amount)
                            }))
                        }
                    });
                }
            );
        }
    );
};

exports.getMonthlyBreakdown = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const year = Number(req.query.year) || new Date().getFullYear();

    reportModel.getMonthlyBreakdown(
        req.session.user.id,
        year,
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to generate monthly breakdown"
                });
            }

            res.json({
                success: true,
                year,
                breakdown: results.map(item => ({
                    month: item.month,
                    income: Number(item.income),
                    expense: Number(item.expense),
                    netSavings: Number(item.income) - Number(item.expense),
                    transactionCount: Number(item.transactionCount)
                }))
            });
        }
    );
};

exports.getQuarterlyBreakdown = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const year = Number(req.query.year) || new Date().getFullYear();

    reportModel.getQuarterlyBreakdown(
        req.session.user.id,
        year,
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to generate quarterly breakdown"
                });
            }

            res.json({
                success: true,
                year,
                breakdown: results.map(item => ({
    quarter: `Q${item.quarterNumber}`,
    income: Number(item.income),
    expense: Number(item.expense),
    netSavings: Number(item.income) - Number(item.expense),
    transactionCount: Number(item.transactionCount)
}))
            });
        }
    );
};

exports.exportCSV = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message: "startDate and endDate are required"
        });
    }

    reportModel.getTransactionsForExport(
        req.session.user.id,
        startDate,
        endDate,
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to export CSV"
                });
            }

            const header = ["Date", "Type", "Category", "Amount"];

            const rows = results.map(item => [
    new Date(item.date).toISOString().split("T")[0],
    item.type,
    item.category,
    Number(item.amount).toFixed(2)
]);

            const csv = [header, ...rows]
                .map(row =>
                    row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
                )
                .join("\n");

            res.setHeader("Content-Type", "text/csv");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="taxpal-report-${startDate}-to-${endDate}.csv"`
            );

            res.send(csv);
        }
    );
};
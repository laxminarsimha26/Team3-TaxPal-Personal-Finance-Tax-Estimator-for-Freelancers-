const taxModel = require("../models/taxmodel");

exports.createTaxEstimate = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const {
        country,
        quarter,
        year,
        estimatedTax,
        dueDate,
        state,
        filingStatus,
        grossIncomeForQuarter,
        businessExpenses,
        retirementContribution,
        healthInsurancePremiums,
        homeOfficeDeduction
    } = req.body;

    if (
        !country ||
        !quarter ||
        !year ||
        estimatedTax === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid tax estimate data"
        });
    }

    taxModel.createTaxEstimate(
        {
            user_id: req.session.user.id,
            country,
            quarter,
            year: Number(year),
            estimated_tax: Number(estimatedTax),
            due_date: dueDate || null,
            state: state || null,
            filing_status:
                filingStatus || null,
            gross_income_for_quarter:
                Number(
                    grossIncomeForQuarter || 0
                ),
            business_expenses:
                Number(
                    businessExpenses || 0
                ),
            retirement_contribution:
                Number(
                    retirementContribution || 0
                ),
            health_insurance_premiums:
                Number(
                    healthInsurancePremiums || 0
                ),
            home_office_deduction:
                Number(
                    homeOfficeDeduction || 0
                )
        },
        (err, result) => {
            if (err) {
                console.error(
                    "Create tax estimate error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to create tax estimate"
                });
            }

            res.status(201).json({
                success: true,
                message:
                    "Tax estimate created successfully",
                taxEstimate: {
                    id: String(
                        result.insertId
                    ),
                    userId: String(
                        req.session.user.id
                    ),
                    country,
                    quarter,
                    year: Number(year),
                    estimatedTax:
                        Number(
                            estimatedTax
                        ),
                    dueDate:
                        dueDate || null,
                    state:
                        state || null,
                    filingStatus:
                        filingStatus || null,
                    grossIncomeForQuarter:
                        Number(
                            grossIncomeForQuarter ||
                            0
                        ),
                    businessExpenses:
                        Number(
                            businessExpenses ||
                            0
                        ),
                    retirementContribution:
                        Number(
                            retirementContribution ||
                            0
                        ),
                    healthInsurancePremiums:
                        Number(
                            healthInsurancePremiums ||
                            0
                        ),
                    homeOfficeDeduction:
                        Number(
                            homeOfficeDeduction ||
                            0
                        ),
                    calculatedAt:
                        Date.now()
                }
            });
        }
    );
};

exports.getTaxEstimates = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    taxModel.getTaxEstimatesByUser(
        req.session.user.id,
        (err, results) => {
            if (err) {
                console.error(
                    "Get tax estimates error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to fetch tax estimates"
                });
            }

            const taxEstimates =
                results.map(tax => ({
                    id: String(tax.id),
                    userId: String(
                        tax.user_id
                    ),
                    country:
                        tax.country,
                    quarter:
                        tax.quarter,
                    year:
                        Number(tax.year),
                    estimatedTax:
                        Number(
                            tax.estimated_tax
                        ),
                    dueDate:
                        tax.due_date,
                    state:
                        tax.state,
                    filingStatus:
                        tax.filing_status,
                    grossIncomeForQuarter:
                        Number(
                            tax.gross_income_for_quarter ||
                            0
                        ),
                    businessExpenses:
                        Number(
                            tax.business_expenses ||
                            0
                        ),
                    retirementContribution:
                        Number(
                            tax.retirement_contribution ||
                            0
                        ),
                    healthInsurancePremiums:
                        Number(
                            tax.health_insurance_premiums ||
                            0
                        ),
                    homeOfficeDeduction:
                        Number(
                            tax.home_office_deduction ||
                            0
                        ),
                    calculatedAt:
                        tax.created_at
                            ? new Date(
                                tax.created_at
                              ).getTime()
                            : Date.now()
                }));

            res.json({
                success: true,
                taxEstimates
            });
        }
    );
};

exports.getTaxEstimate = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    taxModel.getTaxEstimate(
        req.params.id,
        req.session.user.id,
        (err, results) => {
            if (err) {
                console.error(
                    "Get tax estimate error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to fetch tax estimate"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Tax estimate not found"
                });
            }

            const tax = results[0];

            res.json({
                success: true,
                taxEstimate: {
                    id: String(tax.id),
                    userId: String(
                        tax.user_id
                    ),
                    country:
                        tax.country,
                    quarter:
                        tax.quarter,
                    year:
                        Number(tax.year),
                    estimatedTax:
                        Number(
                            tax.estimated_tax
                        ),
                    dueDate:
                        tax.due_date,
                    state:
                        tax.state,
                    filingStatus:
                        tax.filing_status,
                    grossIncomeForQuarter:
                        Number(
                            tax.gross_income_for_quarter ||
                            0
                        ),
                    businessExpenses:
                        Number(
                            tax.business_expenses ||
                            0
                        ),
                    retirementContribution:
                        Number(
                            tax.retirement_contribution ||
                            0
                        ),
                    healthInsurancePremiums:
                        Number(
                            tax.health_insurance_premiums ||
                            0
                        ),
                    homeOfficeDeduction:
                        Number(
                            tax.home_office_deduction ||
                            0
                        ),
                    calculatedAt:
                        Date.now()
                }
            });
        }
    );
};

exports.updateTaxEstimate = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    const {
        country,
        quarter,
        year,
        estimatedTax,
        dueDate,
        state,
        filingStatus,
        grossIncomeForQuarter,
        businessExpenses,
        retirementContribution,
        healthInsurancePremiums,
        homeOfficeDeduction
    } = req.body;

    if (
        !country ||
        !quarter ||
        !year ||
        estimatedTax === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid tax estimate data"
        });
    }

    taxModel.updateTaxEstimate(
        req.params.id,
        req.session.user.id,
        {
            country,
            quarter,
            year: Number(year),
            estimated_tax:
                Number(estimatedTax),
            due_date:
                dueDate || null,
            state:
                state || null,
            filing_status:
                filingStatus || null,
            gross_income_for_quarter:
                Number(
                    grossIncomeForQuarter ||
                    0
                ),
            business_expenses:
                Number(
                    businessExpenses || 0
                ),
            retirement_contribution:
                Number(
                    retirementContribution || 0
                ),
            health_insurance_premiums:
                Number(
                    healthInsurancePremiums ||
                    0
                ),
            home_office_deduction:
                Number(
                    homeOfficeDeduction || 0
                )
        },
        (err, result) => {
            if (err) {
                console.error(
                    "Update tax estimate error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to update tax estimate"
                });
            }

            if (
                result.affectedRows === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Tax estimate not found"
                });
            }

            res.json({
                success: true,
                message:
                    "Tax estimate updated successfully",
                taxEstimate: {
                    id: String(
                        req.params.id
                    ),
                    userId: String(
                        req.session.user.id
                    ),
                    country,
                    quarter,
                    year: Number(year),
                    estimatedTax:
                        Number(
                            estimatedTax
                        ),
                    dueDate:
                        dueDate || null,
                    state:
                        state || null,
                    filingStatus:
                        filingStatus || null,
                    grossIncomeForQuarter:
                        Number(
                            grossIncomeForQuarter ||
                            0
                        ),
                    businessExpenses:
                        Number(
                            businessExpenses ||
                            0
                        ),
                    retirementContribution:
                        Number(
                            retirementContribution ||
                            0
                        ),
                    healthInsurancePremiums:
                        Number(
                            healthInsurancePremiums ||
                            0
                        ),
                    homeOfficeDeduction:
                        Number(
                            homeOfficeDeduction ||
                            0
                        ),
                    calculatedAt:
                        Date.now()
                }
            });
        }
    );
};

exports.deleteTaxEstimate = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }

    taxModel.deleteTaxEstimate(
        req.params.id,
        req.session.user.id,
        (err, result) => {
            if (err) {
                console.error(
                    "Delete tax estimate error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to delete tax estimate"
                });
            }

            if (
                result.affectedRows === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Tax estimate not found"
                });
            }

            res.json({
                success: true,
                message:
                    "Tax estimate deleted successfully"
            });
        }
    );
};
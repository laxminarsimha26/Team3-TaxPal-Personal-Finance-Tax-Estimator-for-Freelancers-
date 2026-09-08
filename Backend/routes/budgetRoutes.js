const express = require("express");
const router = express.Router();

const budgetController = require("../controllers/budgetcontroller");

router.get("/", budgetController.getBudgets);
router.post("/", budgetController.createBudget);
router.put("/:id", budgetController.updateBudget);
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;
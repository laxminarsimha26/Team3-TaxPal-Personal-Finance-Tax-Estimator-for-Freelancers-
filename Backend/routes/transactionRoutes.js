const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");

router.get("/", transactionController.getTransactions);
router.post("/", transactionController.createTransaction);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;

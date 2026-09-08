const express = require("express");

const router = express.Router();

const taxController = require("../controllers/taxcontroller");

router.get("/", taxController.getTaxEstimates);

router.get("/:id", taxController.getTaxEstimate);

router.post("/", taxController.createTaxEstimate);

router.put("/:id", taxController.updateTaxEstimate);

router.delete("/:id", taxController.deleteTaxEstimate);

module.exports = router;
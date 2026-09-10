const express = require("express");
const reportController = require("../controllers/reportController");

const router = express.Router();

router.get("/summary", reportController.getSummary);
router.get("/monthly", reportController.getMonthlyBreakdown);
router.get("/quarterly", reportController.getQuarterlyBreakdown);
router.get("/export/csv", reportController.exportCSV);
router.get("/", reportController.getReports);
router.get("/:id", reportController.getReport);
router.post("/", reportController.createReport);
router.delete("/:id", reportController.deleteReport);

module.exports = router;

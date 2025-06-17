const express = require('express');
const dealReportController = require('../controller/dealReportController'); // Assuming the controller is named dealReportController.js
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/deal-report/:id', authenticateToken, dealReportController.getDealById);

router.get('/deal-report', authenticateToken, dealReportController.getDealReport);

module.exports = router;

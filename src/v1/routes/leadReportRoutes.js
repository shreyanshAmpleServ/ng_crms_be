const express = require('express');
const leadReportController = require('../controller/leadReportController'); // Assuming the controller is named leadReportController.js
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/lead-report/:id', authenticateToken, leadReportController.findLeadById);

router.get('/lead-report', authenticateToken, leadReportController.getLeadReport);

module.exports = router;

const express = require('express');
const companyReportController = require('../controller/companyReportController'); // Assuming the controller is named companyReportController.js
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/company-report/:id', authenticateToken, companyReportController.findCompanyById);

router.get('/company-report', authenticateToken, companyReportController.getCompanyReport);

module.exports = router;

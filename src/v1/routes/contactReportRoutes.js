const express = require('express');
const contactReportController = require('../controller/contactReportController'); // Assuming the controller is named contactReportController.js
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/contact-report/:id', authenticateToken, contactReportController.findContactById);

router.get('/contact-report', authenticateToken, contactReportController.getContactReport);

module.exports = router;

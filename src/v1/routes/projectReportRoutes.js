const express = require('express');
const projectReportController = require('../controller/projectReportController'); // Assuming the controller is named projectReportController.js
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/project-report/:id', authenticateToken, projectReportController.findProjectById);

router.get('/project-report', authenticateToken, projectReportController.getProjectReport);

module.exports = router;

const express = require('express');
const dashboardLeadController = require('../controller/dashboardLeadController'); // Assuming the controller is named dashboardLeadController.js
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/lead-dashboard/:id', authenticateToken, dashboardLeadController.getDealById);

router.get('/lead-dashboard', authenticateToken , dashboardLeadController.getLeadDashboardData);

module.exports = router;

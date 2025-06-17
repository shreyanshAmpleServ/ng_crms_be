const express = require('express');
const TaskReportController = require('../controller/TaskReportController'); // Assuming the controller is named TaskReportController.js
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/task-report/:id', authenticateToken, TaskReportController.findTaskById);

router.get('/task-report', authenticateToken, TaskReportController.getTaskReport);

module.exports = router;

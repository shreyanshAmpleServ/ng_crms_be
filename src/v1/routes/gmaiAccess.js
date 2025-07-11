const express = require('express');
const gmailController = require('../controller/gmailController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/gmail/send', authenticateToken,express.json(),gmailController.sendEmail);
router.get('/gmail/inbox',authenticateToken,  gmailController.getAllEmail);
// router.put('/cases/:id',authenticateToken, casesController.updateCases);
// router.delete('/cases/:id', authenticateToken, casesController.deleteCase);
// router.get('/cases', authenticateToken, casesController.getAllCases);
// router.get('/case-reason', authenticateToken, casesController.getAllCaseReasons);
// router.get('/case-number', authenticateToken, casesController.generateCaseNumber);

module.exports = router;

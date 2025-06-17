const express = require('express');
const ManufacturerController = require('../controller/ManufacturerController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/manufacturer', authenticateToken, ManufacturerController.createManufacturer);
router.get('/manufacturer/:id', authenticateToken, ManufacturerController.findManufacturerById);
router.put('/manufacturer/:id', authenticateToken, ManufacturerController.updateManufacturer);
router.delete('/manufacturer/:id', authenticateToken, ManufacturerController.deleteManufacturer);
router.get('/manufacturer', authenticateToken, ManufacturerController.getAllManufacturer);

module.exports = router;

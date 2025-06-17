const express = require('express');
const menuController = require('../controller/menuController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/menus',authenticateToken,  menuController.createMenuData);
router.get('/menus/:id', authenticateToken, menuController.findMenuDataById);
router.put('/menus/:id', authenticateToken, menuController.updateMenuData);
router.delete('/menus/:id', authenticateToken, menuController.deleteMenuData);
router.get('/menus',authenticateToken,  menuController.getAllMenuData);

module.exports = router;

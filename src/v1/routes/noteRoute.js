const express = require('express');
const noteController = require('../controller/noteController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Import upload middleware

const router = express.Router();

router.post(
    '/notes',
    authenticateToken,
    upload.single('attachment'), // Use middleware for single file upload
    noteController.createNote
);

router.put(
    '/notes/:id',
    authenticateToken,
    upload.single('attachment'), // Use middleware for single file upload
    noteController.updateNote
);

router.get('/notes/:id', authenticateToken, noteController.getNoteById);
router.get('/notes', authenticateToken, noteController.getAllNotes);
router.delete('/notes/:id', authenticateToken, noteController.deleteNote);

module.exports = router;

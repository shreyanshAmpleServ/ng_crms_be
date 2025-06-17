const noteService = require('../services/noteService');
const CustomError = require('../../utils/CustomError');
const { generateFullUrl } = require('../../utils/helper');

const sanitizeNoteData = (data) => {
    return {
        title: data.title ? String(data.title).trim() : null,
        note: data.note ? String(data.note).trim() : null,
        attachment: data.attachment ? String(data.attachment).trim() : null,

        // Metadata
        createdBy: data.createdBy || 1,
        log_inst: data.log_inst || 1,
    };
};

const createNote = async (req, res, next) => {
    try {
        const attachmentPath = req.file ? req.file.path : null;
        let noteData = { ...req.body, attachment: generateFullUrl(req, attachmentPath) };
        noteData = sanitizeNoteData(noteData);

        const note = await noteService.createNote(noteData);
        res.status(201).success('Note created successfully', note);
    } catch (error) {
        next(error);
    }
};

const getNoteById = async (req, res, next) => {
    try {
        const note = await noteService.findNoteById(req.params.id);
        if (!note) throw new CustomError('Note not found', 404);

        res.status(200).success(null, note);
    } catch (error) {
        next(error);
    }
};

const updateNote = async (req, res, next) => {
    try {
        const attachmentPath = req.file ? req.file.path : null;
        let noteData = { ...req.body };
        if (attachmentPath) noteData.attachment = generateFullUrl(req, attachmentPath);

        noteData = sanitizeNoteData(noteData);

        const note = await noteService.updateNote(req.params.id, noteData);
        res.status(200).success('Note updated successfully', note);
    } catch (error) {
        next(error);
    }
};

const deleteNote = async (req, res, next) => {
    try {
        await noteService.deleteNote(req.params.id);
        res.status(200).success('Note deleted successfully', null);
    } catch (error) {
        next(error);
    }
};

const getAllNotes = async (req, res, next) => {
    try {
        const notes = await noteService.getAllNotes();
        res.status(200).success(null, notes);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
    getAllNotes,
};

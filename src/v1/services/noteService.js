const noteModel = require('../models/noteModel');

const createNote = async (data) => {
    return await noteModel.createNote(data);
};

const findNoteById = async (id) => {
    return await noteModel.findNoteById(id);
};

const updateNote = async (id, data) => {
    return await noteModel.updateNote(id, data);
};

const deleteNote = async (id) => {
    return await noteModel.deleteNote(id);
};

const getAllNotes = async () => {
    return await noteModel.getAllNotes();
};

module.exports = {
    createNote,
    findNoteById,
    updateNote,
    deleteNote,
    getAllNotes,
};

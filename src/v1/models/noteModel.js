const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");

// Create a new note
const createNote = async (data) => {
  try {
    const note = await prisma.crms_notes.create({
      data: {
        title: data.title,
        note: data.note || null,
        attachment: data.attachment || null,
        is_active: data.is_active || "Y",
        createdby: data.createdby || 1,
        log_inst: data.log_inst || 1,
      },
    });
    return note;
  } catch (error) {
    throw new CustomError(`Error creating note: ${error.message}`, 500);
  }
};

// Find a note by ID
const findNoteById = async (id) => {
  try {
    const note = await prisma.crms_notes.findUnique({
      where: { id: parseInt(id) },
    });
    if (!note) {
      throw new CustomError("Note not found", 404);
    }
    return note;
  } catch (error) {
    throw new CustomError(`Error finding note by ID: ${error.message}`, 503);
  }
};

// Update a note
const updateNote = async (id, data) => {
  try {
    const updatedNote = await prisma.crms_notes.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updatedate: new Date(),
      },
    });
    return updatedNote;
  } catch (error) {
    throw new CustomError(`Error updating note: ${error.message}`, 500);
  }
};

// Delete a note
const deleteNote = async (id) => {
  try {
    await prisma.crms_notes.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    throw new CustomError(`Error deleting note: ${error.message}`, 500);
  }
};

// Get all notes
const getAllNotes = async () => {
  try {
    const notes = await prisma.crms_notes.findMany({
      orderBy: [{ updatedate: "desc" }, { createdate: "desc" }],
    });
    return notes;
  } catch (error) {
    throw new CustomError("Error retrieving notes", 503);
  }
};

module.exports = {
  createNote,
  findNoteById,
  updateNote,
  deleteNote,
  getAllNotes,
};

const AttachmentModel = require("../models/FileAttachmentModel");

const createAttachment = async (data, user) => {
  return await AttachmentModel.createAttachment(data, user);
};

const findAttachmentById = async (id) => {
  return await AttachmentModel.findAttachmentById(id);
};

const updateAttachment = async (id, data, user) => {
  return await AttachmentModel.updateAttachment(id, data, user);
};

const deleteAttachment = async (id) => {
  return await AttachmentModel.deleteAttachment(id);
};

const getAllAttachment = async (
  search,
  page,
  size,
  startDate,
  endDate,
  related_type
) => {
  return await AttachmentModel.getAllAttachment(
    search,
    page,
    size,
    startDate,
    endDate,
    related_type
  );
};

module.exports = {
  createAttachment,
  findAttachmentById,
  updateAttachment,
  deleteAttachment,
  getAllAttachment,
};

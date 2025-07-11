const gmailModel = require('../models/gmailModel');

const sendEmail = async (data) => {
  return await gmailModel.sendGmailModal(data);
};
const getAllEmail = async (res,data) => {
  return await gmailModel.getGmailModal(res,data);
};


module.exports = {
  sendEmail,
  getAllEmail,
};

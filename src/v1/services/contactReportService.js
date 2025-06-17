const contactReportModel = require('../models/contactReportModel');

const findContactById = async (id) => {
  return await contactReportModel.findContactById(id);
};
const getContactReport = async (filterDays) => {
  return await contactReportModel.getContactReport(filterDays);
};

module.exports = {
  findContactById,
  getContactReport,
};

const leadReportModel = require('../models/leadReportModel');

const findLeadById = async (id) => {
  return await leadReportModel.findLeadById(id);
};
const getLeadReport = async (filterDays) => {
  return await leadReportModel.getLeadReport(filterDays);
};

module.exports = {
  findLeadById,
  getLeadReport,
};

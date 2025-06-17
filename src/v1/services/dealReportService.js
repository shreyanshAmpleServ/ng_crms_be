const dealReportModel = require('../models/dealReportModel');

const findDealById = async (id) => {
  return await dealReportModel.findDealById(id);
};
const getDealReport = async (filterDays) => {
  return await dealReportModel.getDealReport(filterDays);
};

module.exports = {
  findDealById,
  getDealReport,
};

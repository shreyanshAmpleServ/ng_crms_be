const projectReportModel = require('../models/projectReportModel');

const findProjectById = async (id) => {
  return await projectReportModel.findProjectById(id);
};
const getProjectReport = async (filterDays) => {
  return await projectReportModel.getProjectReport(filterDays);
};

module.exports = {
  findProjectById,
  getProjectReport,
};

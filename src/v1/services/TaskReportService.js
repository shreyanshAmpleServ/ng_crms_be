const TaskReportModel = require('../models/TaskReportModel');

const findTaskById = async (id) => {
  return await TaskReportModel.findTaskById(id);
};
const getTaskReport = async (filterDays) => {
  return await TaskReportModel.getTaskReport(filterDays);
};

module.exports = {
  findTaskById,
  getTaskReport,
};

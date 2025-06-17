const TaskReportService = require('../services/TaskReportService');
const CustomError = require('../../utils/CustomError');



const findTaskById = async (req, res, next) => {
  try {
    const getData = await TaskReportService.findTaskById(req.params.id);
    if (!getData) throw new CustomError('Leads not found', 404);
    res.status(200).success(null, getData);
  } catch (error) {
    next(error);
  }
};


const getTaskReport = async (req, res, next) => {
  try {
    const getAllData = await TaskReportService.getTaskReport(req.query.filterDays);
    res.status(200).success(null, getAllData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findTaskById,
  getTaskReport,
};
const projectReportService = require('../services/projectReportService');
const CustomError = require('../../utils/CustomError');



const findProjectById = async (req, res, next) => {
  try {
    const getData = await projectReportService.findProjectById(req.params.id);
    if (!getData) throw new CustomError('Project not found', 404);
    res.status(200).success(null, getData);
  } catch (error) {
    next(error);
  }
};


const getProjectReport = async (req, res, next) => {
  try {
    const getAllData = await projectReportService.getProjectReport(req.query.filterDays);
    res.status(200).success(null, getAllData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findProjectById,
  getProjectReport,
};
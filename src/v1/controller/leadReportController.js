const leadReportService = require('../services/leadReportService');
const CustomError = require('../../utils/CustomError');



const findLeadById = async (req, res, next) => {
  try {
    const getData = await leadReportService.findLeadById(req.params.id);
    if (!getData) throw new CustomError('Leads not found', 404);
    res.status(200).success(null, getData);
  } catch (error) {
    next(error);
  }
};


const getLeadReport = async (req, res, next) => {
  try {
    const getAllData = await leadReportService.getLeadReport(req.query.filterDays);
    res.status(200).success(null, getAllData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findLeadById,
  getLeadReport,
};
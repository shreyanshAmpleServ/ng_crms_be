const dealReportService = require('../services/dealReportService');
const CustomError = require('../../utils/CustomError');



const getDealById = async (req, res, next) => {
  try {
    const getData = await dealReportService.findDealById(req.params.id);
    if (!getData) throw new CustomError('Deals not found', 404);
    res.status(200).success(null, getData);
  } catch (error) {
    next(error);
  }
};


const getDealReport = async (req, res, next) => {
  try {
    const getAllData = await dealReportService.getDealReport(req.query.filterDays);
    res.status(200).success(null, getAllData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDealById,
  getDealReport,
};
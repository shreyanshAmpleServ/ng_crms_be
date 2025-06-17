const companyReportService = require('../services/companyReportService');
const CustomError = require('../../utils/CustomError');



const findCompanyById = async (req, res, next) => {
  try {
    const getData = await companyReportService.findDealById(req.params.id);
    if (!getData) throw new CustomError('Company not found', 404);
    res.status(200).success(null, getData);
  } catch (error) {
    next(error);
  }
};


const getCompanyReport = async (req, res, next) => {
  try {
    const getAllData = await companyReportService.getCompanyReport(req.query.filterDays);
    res.status(200).success(null, getAllData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findCompanyById,
  getCompanyReport,
};
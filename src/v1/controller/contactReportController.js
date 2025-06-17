const contactReportService = require('../services/contactReportService');
const CustomError = require('../../utils/CustomError');



const findContactById = async (req, res, next) => {
  try {
    const getData = await contactReportService.findDealById(req.params.id);
    if (!getData) throw new CustomError('Contact not found', 404);
    res.status(200).success(null, getData);
  } catch (error) {
    next(error);
  }
};


const getContactReport = async (req, res, next) => {
  try {
    const getAllData = await contactReportService.getContactReport(req.query.filterDays);
    res.status(200).success(null, getAllData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findContactById,
  getContactReport
};
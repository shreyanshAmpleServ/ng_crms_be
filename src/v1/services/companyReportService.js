const companyReportModel = require('../models/companyReportModel');

const findCompanyById = async (id) => {
  return await companyReportModel.findCompanyById(id);
};
const getCompanyReport = async (filterDays) => {
  return await companyReportModel.getCompanyReport(filterDays);
};

module.exports = {
  findCompanyById,
  getCompanyReport,
  
};

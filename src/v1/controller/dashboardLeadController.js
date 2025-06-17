const dashboardLeadService = require('../services/dashboardLeadService');
const CustomError = require('../../utils/CustomError');



const getDealById = async (req, res, next) => {
  try {
    const getData = await dashboardLeadService.findDealById(req.params.id);
    if (!getData) throw new CustomError('Deals not found', 404);
    res.status(200).success(null, getData);
  } catch (error) {
    next(error);
  }
};


const getLeadDashboardData = async (req, res, next) => {
  try {
    const getAllData = await dashboardLeadService.getLeadDashboardData(req.query.filterDays || {});
    res.status(200).success(null, getAllData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDealById,
  getLeadDashboardData,
};
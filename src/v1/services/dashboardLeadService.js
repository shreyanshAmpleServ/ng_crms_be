const dashboardLeadModel = require('../models/dashboardLeadModel');

const findDealById = async (id) => {
  return await dashboardLeadModel.findDealById(id);
};
const  getLeadDashboardData = async (filterDays) => {
  return await dashboardLeadModel.getLeadDashboardData(filterDays);
};

module.exports = {
  findDealById,
   getLeadDashboardData,
};

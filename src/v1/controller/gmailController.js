const gmailService = require('../services/gmailService');
const CustomError = require('../../utils/CustomError');
const moment = require("moment");

// const sanitizeCaseData = (data) => {
//   return {
//         ...data,
//         product_id: Number(data?.product_id) || null,
//         case_reason: Number(data?.case_reason) || null,
//         contact_id: Number(data?.contact_id) || null,
//         deal_id: Number(data?.deal_id) || null,
//         case_owner_id: data.case_owner_id ? Number(data.case_owner_id) : null,
//         account_id: Number(data?.account_id) || null,
//         reported_by: Number(data?.reported_by) || null,
//         is_active: data.is_active || "Y",
//         log_inst: data.log_inst || 1,
//         description: data.description ? String(data.description).trim() : "",
//   };
// };

const sendEmail = async (req, res, next) => {
  try {
    const cases = await gmailService.sendEmail(req.body);
    res.status(201).success('Email send successfully', cases);
  } catch (error) {
    next(error);
  }
};


const getAllEmail = async (req, res, next) => {
  try {
    // const { page , size , search ,startDate,endDate } = req.query;
    // const casess = await gmailService.getAllEmail(search ,Number(page), Number(size),startDate && moment(startDate),endDate && moment(endDate));
    const casess = await gmailService.getAllEmail(res,req.user);
    res.status(200).success(null, casess);
  } catch (error) {
    next(error);
  }
};



module.exports = {
  sendEmail,
  getAllEmail,
};

const redirectionLoginModel = require("../models/redirectionLoginModel");

const redirectionLogin = async (data) => {
  return await redirectionLoginModel.redirectionLogin(data);
};

module.exports = {
  redirectionLogin,
};

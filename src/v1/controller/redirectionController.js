const redirectionLoginService = require("../services/redirectionLoginService");
const CustomError = require("../../utils/CustomError");

const redirectionLogin = async (req, res, next) => {
  try {
    const role = await redirectionLoginService.redirectionLogin(req.body);
    res.status(201).success("Login redirection successfully", role);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  redirectionLogin,
};

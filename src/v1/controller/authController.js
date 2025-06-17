const { registerUser, loginUser } = require("../services/authService");
const axios = require("axios");

const register = async (req, res, next) => {
  try {
    const { email, password, fullName = null } = req.body;

    const user = await registerUser(email, password, fullName);
    res.status(201).success("User registered successfully", user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);

    // Set token in HTTP-Only cookie
    // res.cookie('authToken', data.token, {
    //   httpOnly: true,
    //   secure: false, // Set `true` in production for HTTPS
    //   // sameSite: 'Lax',
    //   sameSite: 'Strict',
    //   maxAge:  24 * 60 * 60 * 1000,// Cookie  valid for 1 day
    // });
    res
      .status(200)
      .success("Login successful", { ...data.user, Token: data.token });
  } catch (error) {
    console.log("Auth Error", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};
const logout = async (req, res, next) => {
  try {
    const Blapiurl = req.headers["blapiurl"];
    const authToken = req.headers["authorization"];
    const response = await axios.get(`${Blapiurl}/api/Auth/Logout`, {
      headers: {
        Authorization: authToken,
        Accept: "application/json",
      },
    });
    console.log("logout : ", response);
    // Clear the authToken cookie by setting its maxAge to 0
    // res.clearCookie('authToken', {
    //   httpOnly: true,
    //   secure: false, // Set `true` in production for HTTPS
    //     //  sameSite: 'Lax',
    //   sameSite: 'Strict',
    // });

    res.status(200).success("Logout successful", null);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout };

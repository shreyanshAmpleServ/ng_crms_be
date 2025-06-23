const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const axios = require("axios");
const userModel = require("../models/userModel"); // Import your user model to fetch user details from DB or cache

const authenticateToken = async (req, res, next) => {
  // const token = req.cookies?.authToken; // Get the token from the cookie

  // if (!token) {
  //   return res.error('Access denied. No token provided.', 403); // Using res.error for error response
  // }
  try {
    const authHeaders = req.headers["blapiurl"];
    const authToken = req.headers["authorization"];
    const domain = req.headers["domain"];
    // if (domain == "mowara") {
      try {
        // Step 1: Get API URL config for the domain
        const arrAPIConfig = await getAPIUrls(domain);
      
        if (!authToken || !authToken.startsWith("Bearer ")) {
          return res.status(401).json({ message: "No token provided" });
        }
        if (!arrAPIConfig || !arrAPIConfig.BLApiUrl) {
          console.error("Invalid API config or BLApiUrl not found.");
          return 1;
        }
        
        // Step 2: Call the BLApiUrl endpoint to validate the token
        const response = await axios.get(
          `${arrAPIConfig.BLApiUrl}/api/User/GetUserwithToken`,
          {
            headers: {
              Authorization: authToken,
              Accept: "application/json",
            },
          }
        );

        const responseData = response.data;

        if (!responseData?.data || !responseData.data[0]) {
          return res.status(403).json({ message: "Not Authorized by token" });
        }

        if (response.data.data.length <= 0) {
          return res.error("User not found", 403); // Using res.error for user not found
        }

        req.user = response.data.data[0];
        next();
      } catch (error) {
        console.error("getAPIConfigWithToken error:", error.message);
        return res.status(403).json({ message: "Not Authorized by token" });
      }
    // } else {
    //   const authHeader = req.headers["authorization"];
    //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //     return res.status(401).json({ message: "No token provided" });
    //   }
    //   const token = authHeader.split(" ")[1];
    //   const decoded = jwt.verify(token, jwtSecret); // Decode the JWT token
    //   const userId = decoded.userId; // Extract userId from the decoded token

    //   // Fetch the user from the database or cache using the userId
    //   const user = await userModel.findUserById(userId); // This assumes a `findUserById` method in your user model

    //   if (!user) {
    //     return res.error("User not found", 403); // Using res.error for user not found
    //   }

    //   req.user = user; // Attach the full user object to the request object
    //   next(); // Proceed to the next middleware or route handler}
    // }
  } catch (error) {
    console.log("Auth error : ",error)
    return res.error(
      error.message || "Invalid or expired token",
      error.status || 403
    ); // Using res.error for invalid token
  }
};

const getAPIUrls = async (domain) => {
  try {
    const VL_ApiUrlVerify = "https://logsuitedomainverify.dcctz.com";
    const response = await axios.get(`${VL_ApiUrlVerify}/api/verify`, {
      params: { subdomain: domain },
      headers: {
        Accept: "application/json",
      },
    });

    return response.data; // This should return { BLApiUrl, ... }
  } catch (error) {
    console.error("Error in getAPIUrls:", error.message);
    return res.status(403).json({ message: "Not Authorized by token" });
  }
};

module.exports = { authenticateToken };

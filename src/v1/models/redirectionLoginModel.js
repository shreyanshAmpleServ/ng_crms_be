const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");
const axios = require("axios");

const redirectionLogin = async (data) => {
  const VL_Token = data.token;
  const VL_Domain = data.Domain;
  const domainVerifyUrl = process.env.DOMAINVERIFYURL;

  try {
    // Step 1: Verify subdomain
    const responseGetSubDomain = await axios.get(
      `${domainVerifyUrl}/api/verify?subdomain=${VL_Domain}`,
      { headers: { Accept: "application/json" } }
    );

    const arrResponseDomain = responseGetSubDomain.data;
    // console.log("Error of domain 1 : ", arrResponseDomain);
    if (arrResponseDomain && Object.keys(arrResponseDomain).length > 0) {
      // const VL_api_url = "http://localhost:5000/api/v1/";
        const VL_api_url = arrResponseDomain.crms_api;
      const VL_BLApiUrl = arrResponseDomain.BLApiUrl;

      // Step 2: POST to login on cargo_app_api
      //   const loginResponse = await axios.post(
      //     `${VL_api_url}/login`,
      //     {
      //       token: VL_Token,
      //       BLApiUrl: VL_BLApiUrl,
      //       DBName: arrResponseDomain.DBName,
      //     },
      //     {
      //       headers: { Accept: "application/json" },
      //     }
      //   );
      let loginResponse = await loginByRedirection({
        token: VL_Token,
        BLApiUrl: VL_BLApiUrl,
        DBName: arrResponseDomain.DBName,
      });

      const arrResponse = loginResponse.data.data[0];
      //   console.log("Array Response 2: ", arrResponse);
      // Step 3: GET permissions
      const permissionResponse = await axios.get(
        `${VL_BLApiUrl}/api/Menu/GetMenuList?module_code=LSNGSA2001`,
        {
          headers: {
            Authorization: `Bearer ${VL_Token}`,
            // Accept: "application/json", // Optional
          },
        }
      );

      const arrResponsePermission = permissionResponse.data;
      //   console.log("Get permission : ", arrResponsePermission);

      // Step 4: Handle login success
      if (loginResponse.success) {
        // const session = req.session;
        // session.token = VL_Token;
        // session.user = arrResponse.data;
        // session.api_url = VL_api_url;
        // session.DBName = arrResponseDomain.DBName;
        // session.BLApiUrl = VL_BLApiUrl;
        // session.Domain = VL_Domain;
        // session.SubDomain = `https://${VL_Domain}.dcclogsuite.com`;
        // session.user_type = 1;

        // if (arrResponsePermission.data) {
        //   session.user_permission = arrResponsePermission.data;
        // }

        return {
          success: true,
          api_url: VL_api_url,
          token: VL_Token,
          user: arrResponse,
          DBName: arrResponseDomain.DBName,
          BLApiUrl: VL_BLApiUrl,
          Domain: VL_Domain,
          SubDomain: `https://${VL_Domain}.dcclogsuite.com`,
          user_type: 1,
          permissions: permissionResponse.data,
        };
      } else {
        throw new CustomError(
          "Login failed (It seems that you have entered an incorrect email or password.)",
          401
        );
      }
    } else {
      throw new CustomError("You are not authorized to access it!", 403);
    }
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw new CustomError("An error occurred during login", 500);
  }
  //   try {
  //   } catch (error) {
  //     console.log("Error to Creating Calls", error);
  //     throw new CustomError(`Error creating call : ${error.message}`, 500);
  //   }
};
const loginByRedirection = async (data) => {
  const { token: VL_token, BLApiUrl: VL_ApiUrl, DBName } = data;

  try {
    // Step 1: Call external API to get user with token
    const response = await axios.get(`${VL_ApiUrl}/api/User/GetUserwithToken`, {
      headers: {
        Authorization: `Bearer ${VL_token}`,
        Accept: "application/json",
      },
    });

    const responseData = response.data;

    // Step 2: If valid response, build final object
    if (responseData.data && responseData.data.length > 0) {
      const arrType = [
        { id: "A", name: "All" },
        { id: "L", name: "Local" },
        { id: "T", name: "Transit" },
      ];

      const arrData = responseData.data[0];

      // Example DB call (make sure your connection handles DBName selection if needed)
      //   const arrComp = await db("analytic_configuration").first();

      //   arrData.configuration = arrComp;
      //   arrData.type = arrType;

      return {
        success: true,
        api_token: VL_token,
        data: responseData,
        type: arrType,
        message: "success",
      };
    } else {
      return {
        success: false,
        message:
          "Login failed (It seems that you have entered an incorrect email or password.)",
      };
    }
  } catch (error) {
    console.error("API Login Error:", error.response?.data || error.message);
    return {
      success: false,
      message: "Something went wrong during login.",
    };
  }
};

module.exports = {
  redirectionLogin,
};

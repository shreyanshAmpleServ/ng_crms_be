const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");
const { generateAuthUrl } = require("../../utils/gmailAuth");

async function setValidGmailCredentials(userId) {
  const user = await db.dumy_user.findUnique({ where: { id: userId } });

  if (!user || !user.access_token) {
    return { needsOAuth: true };
  }

  const now = Date.now();
  const isExpired = user.expiry_date && now >= user.expiry_date;

  oAuth2Client.setCredentials({
    access_token: user.access_token,
    refresh_token: user.refresh_token
  });

  if (isExpired) {
    try {
      const newTokens = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(newTokens.credentials);

      await db.dumy_user.update({
        where: { id: userId },
        data: {
          access_token: newTokens.credentials.access_token,
          expiry_date: newTokens.credentials.expiry_date
        }
      });
    } catch (err) {
      return { needsOAuth: true };
    }
  }

  return { gmail: google.gmail({ version: 'v1', auth: oAuth2Client }) };
}

// Create a new case
const sendGmailModal = async (data) => {
  try {
    const { to, subject, body } = data;

    const state = {
      userId: req.user.id,
      action: 'send',
      to,
      subject,
      body
    };
  
    const url = generateAuthUrl(state);
    res.json({ authUrl: url });
  } catch (error) {
    console.log(error);
    throw new CustomError(`Error creating case: ${error.message}`, 500);
  }
};
const getGmailModal = async (res,data) => {
  try {
    const url = generateAuthUrl({ userId: data.id, action: 'inbox' });
    console.log("URL ",url)
    return res.redirect(url);
  } catch (error) {
    console.log("jjjjj",error);
    throw new CustomError(`Error creating case: ${error.message}`, 500);
  }
};

module.exports = {
  sendGmailModal,
  getGmailModal
};

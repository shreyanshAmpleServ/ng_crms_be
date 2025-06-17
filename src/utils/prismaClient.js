// utils/prismaClient.js
const { PrismaClient } = require("@prisma/client");

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    console.log("🌱 Created new PrismaClient instance (dev)");
  } else {
    console.log("♻️ Reusing existing PrismaClient instance (dev)");
  }
  prisma = global.prisma;
}

module.exports = prisma;

const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const moment = require("moment");
const prisma = require("../../utils/prismaClient");

// Parse `tags` after retrieving it
const parseTags = (deal) => {
  if (deal && deal.tags) {
    deal.tags = JSON.parse(deal.tags);
  }
  return deal;
};

// Find a deal by its ID
const findProjectById = async (id) => {
  try {
    const deal = await prisma.Project.findUnique({
      where: { id: parseInt(id) },
      include: {
        DealContacts: {
          include: {
            contact: true, // Include contact details
          },
        },
        DealHistory: true,
      },
    });
    return parseTags(deal);
  } catch (error) {
    throw new CustomError("Error finding deal by ID", 503);
  }
};

// Get all deals
const getProjectReport = async (filterDays) => {
  try {
    console.log("filterDays", filterDays);
    const yearFilter = filterDays?.yearFilter;
    const { startDate, endDate } = filterDays?.tableDate;
    const { startDate: startDate2, endDate: endDate2 } =
      filterDays?.stageFilter;
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    const startMoment2 = moment(startDate2);
    const endMoment2 = moment(endDate2);

    if (!startMoment.isValid() || !endMoment.isValid()) {
      throw new Error("Invalid date range provided");
    }
    if (!startMoment2.isValid() || !endMoment2.isValid()) {
      throw new Error("Invalid date range provided");
    }
    const projects = await prisma.Project.findMany({
      where: {
        createdDate: {
          gte: startMoment.toDate(), // Get deals from the selected range
          lte: endMoment.toDate(), // Get deals from the last `filterDays`
        },
      },
      orderBy: [{ updatedDate: "desc" }, { createdDate: "desc" }],
    });

    const Project2 = await prisma.Project.findMany({
      where: {
        ...(yearFilter && {
          createdDate: {
            gte: new Date(`${yearFilter}-01-01T00:00:00.000Z`),
            lt: new Date(`${Number(yearFilter) + 1}-01-01T00:00:00.000Z`),
          },
        }),
      },
    });
    const monthlyCreatedProject = {};

    Project2.forEach((data) => {
      const createdMonth = new Date(data.createdDate).getMonth() + 1; // 1-12

      if (!monthlyCreatedProject[createdMonth]) {
        monthlyCreatedProject[createdMonth] = 0;
      }

      monthlyCreatedProject[createdMonth] += 1;
    });
    return {
      projects: projects,
      monthlyProject: monthlyCreatedProject,
    };
  } catch (error) {
    console.log("Project getting error : ", error);
    throw new CustomError("Error retrieving project", 503);
  }
};
module.exports = {
  findProjectById,
  getProjectReport,
};

const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const moment = require("moment");
const { name } = require("../../utils/emailQueue");
const prisma = require("../../utils/prismaClient");

// Parse `tags` after retrieving it
const parseTags = (deal) => {
  if (deal && deal.tags) {
    deal.tags = JSON.parse(deal.tags);
  }
  return deal;
};

// Find a deal by its ID
const findTaskById = async (id) => {
  try {
    const deal = await prisma.crms_d_activities.findUnique({
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
const getTaskReport = async (filterDays) => {
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
    const Tasks = await prisma.crms_d_activities.findMany({
      where: {
        createddate: {
          gte: startMoment.toDate(), // Get deals from the selected range
          lte: endMoment.toDate(), // Get deals from the last `filterDays`
        },
        crms_m_activitytypes: {
          is: {
            name: "Task",
          },
        },
      },
      include: {
        crms_m_activitytypes: {
          select: {
            id: true,
            name: true,
          },
        },
        crms_m_user: {
          select: {
            id: true,
            full_name: true,
            profile_img: true,
          },
        },
      },

      orderBy: [{ updateddate: "desc" }, { createddate: "desc" }],
    });

    const deal1 = await prisma.crms_d_activities.findMany({
      where: {
        ...(yearFilter && {
          createddate: {
            gte: new Date(`${yearFilter}-01-01T00:00:00.000Z`),
            lt: new Date(`${Number(yearFilter) + 1}-01-01T00:00:00.000Z`),
          },
          crms_m_activitytypes: {
            is: {
              name: "Task",
            },
          },
        }),
      },
    });
    const monthlyCreatedLeads = {};

    deal1.forEach((deal) => {
      const createdMonth = new Date(deal.createddate).getMonth() + 1; // 1-12

      if (!monthlyCreatedLeads[createdMonth]) {
        monthlyCreatedLeads[createdMonth] = 0;
      }

      monthlyCreatedLeads[createdMonth] += 1;
    });
    const deal2 = await prisma.crms_d_activities.findMany({
      where: {
        createddate: {
          gte: startMoment2.toDate(),
          lte: endMoment2.toDate(),
        },
        crms_m_activitytypes: {
          is: {
            name: "Task",
          },
        },
      },
      include: {
        crms_m_activitytypes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const sourceMap = new Map();

    deal2.forEach((deal) => {
      const sourceName = deal.status || "Unknown";

      if (sourceMap.has(sourceName)) {
        sourceMap.get(sourceName).count += 1;
      } else {
        sourceMap.set(sourceName, { source: sourceName, count: 1 });
      }
    });

    // Convert Map to Array
    const stageSummary = Array.from(sourceMap.values());

    return {
      Tasks: Tasks,
      TaskByStatus: stageSummary,
      monthlyTasks: monthlyCreatedLeads,
    };
  } catch (error) {
    console.log("lead getting error : ", error);
    throw new CustomError("Error retrieving Task", 503);
  }
};
module.exports = {
  findTaskById,
  getTaskReport,
};

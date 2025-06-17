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
const findDealById = async (id) => {
  try {
    const deal = await prisma.Deal.findUnique({
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
const getDealReport = async (filterDays) => {
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
    const deal = await prisma.Deal.findMany({
      where: {
        createdDate: {
          gte: startMoment.toDate(), // Get deals from the selected range
          lte: endMoment.toDate(), // Get deals from the last `filterDays`
        },
      },
      include: {
        deals: true,
        DealContacts: {
          include: { contact: true },
        },
        pipeline: true,
      },

      orderBy: [{ updatedDate: "desc" }, { createdDate: "desc" }],
    });

    // Process deals to count them by month
    const dealss = await prisma.Deal.findMany({
      where: {
        ...(yearFilter && {
          createdDate: {
            gte: new Date(`${yearFilter}-01-01T00:00:00.000Z`),
            lt: new Date(`${Number(yearFilter) + 1}-01-01T00:00:00.000Z`),
          },
        }),
      },
    });
    const monthlyDeals = {};

    dealss.forEach((deal) => {
      const month = new Date(deal.dueDate).getMonth() + 1; // 1-12
      const status = deal.status; // "Won", "Lost", etc.
      const value = deal.dealValue || 0;

      if (!monthlyDeals[month]) {
        monthlyDeals[month] = { Won: 0, Lost: 0 };
      }

      if (status === "Won") {
        monthlyDeals[month].Won += value;
      } else if (status === "Lost") {
        monthlyDeals[month].Lost += value;
      }
    });
    const dealssss = await prisma.Deal.findMany({
      where: {
        createdDate: {
          gte: startMoment2.toDate(),
          lte: endMoment2.toDate(),
        },
      },

      // ...(filterDays?.lostDealFilter && {pipelineId :Number(filterDays?.lostDealFilter)})},
      include: {
        deals: true,
        pipeline: true,
      },
    });
    const stageSummary = dealssss.reduce((acc, deal) => {
      const stageName = deal.deals?.name || "Unknown";

      // Find if this stage already exists in accumulator
      const existingStage = acc.find((item) => item.stage === stageName);

      if (existingStage) {
        existingStage.count += 1;
        existingStage.totalDealValue += deal.dealValue || 0;
      } else {
        acc.push({
          stage: stageName,
          count: 1,
          totalDealValue: deal.dealValue || 0,
        });
      }

      return acc;
    }, []);

    return {
      deal: deal,
      stageWiseDeals: stageSummary,
      monthlyDeals: monthlyDeals,
    };
  } catch (error) {
    console.log("Dashboard getting error : ", error);
    throw new CustomError("Error retrieving dashboard", 503);
  }
};
module.exports = {
  findDealById,
  getDealReport,
};

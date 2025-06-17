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
    const deal = await prisma.crms_leads.findUnique({
      where: { id: parseInt(id) },
      // include: {
      //   DealContacts: {
      //     include: {
      //       contact: true, // Include contact details
      //     },
      //   },
      //   DealHistory: true,
      // },
    });
    return parseTags(deal);
  } catch (error) {
    throw new CustomError("Error finding deal by ID", 503);
  }
};

// Get all deals
const getLeadDashboardData = async (filterDays) => {
  try {
    const { startDate, endDate } = filterDays;
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);

    if (!startMoment.isValid() || !endMoment.isValid()) {
      throw new Error("Invalid date range provided");
    }
    const leads = await prisma.crms_leads.findMany({
      where: {
        createdate: {
          gte: startMoment.toDate(), // Get deals from the selected range
          lte: endMoment.toDate(), // Get deals from the last `filterDays`
        },
      },
      include: {
        lead_company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        crms_m_sources: true,
        crms_m_lost_reasons: true,
      },
      take: 10,
      orderBy: [{ updatedate: "desc" }, { createdate: "desc" }],
    });
    const leadForWin = await prisma.crms_leads.findMany({
      where: {
        ...(startMoment &&
          endMoment && {
            createdate: {
              gte: startMoment.toDate(),
              lte: endMoment.toDate(),
            },
          }),
        // ...(filterDays?.wonDealFilter && {
        //   pipelineId: Number(filterDays?.wonDealFilter),
        // }),
      },
      include: {
        crms_m_sources: true,
        crms_m_lost_reasons: true,
      },
    });
    const wonLeads = leadForWin.filter(
      (deal) => deal.crms_m_lost_reasons.name === "Won"
    );
    const leadForLoss = await prisma.crms_leads.findMany({
      where: {
        ...(startMoment &&
          endMoment && {
            createdate: {
              gte: startMoment.toDate(),
              lte: endMoment.toDate(),
            },
          }),
        // ...(filterDays?.lostDealFilter && {pipelineId :Number(filterDays?.lostDealFilter)})
      },
      include: {
        crms_m_sources: true,
        crms_m_lost_reasons: true,
      },
    });
    const lostLeads = leadForLoss.filter(
      (deal) => deal.crms_m_lost_reasons.name === "Lost"
    );

    const deal1 = await prisma.crms_leads.findMany({
      where: {
        // ...(yearFilter && {
        //   createdate: {
        //     gte: new Date(`${yearFilter}-01-01T00:00:00.000Z`),
        //     lt: new Date(`${Number(yearFilter) + 1}-01-01T00:00:00.000Z`),
        //   },
        // }),
        ...(filterDays?.monthlyLeadFilter && {
          lead_status: Number(filterDays?.monthlyLeadFilter),
        }),
      },
    });
    const monthlyCreatedLeads = {};

    deal1.forEach((deal) => {
      const createdMonth = new Date(deal.createdate).getMonth() + 1; // 1-12

      if (!monthlyCreatedLeads[createdMonth]) {
        monthlyCreatedLeads[createdMonth] = 0;
      }

      monthlyCreatedLeads[createdMonth] += 1;
    });
    const deal2 = await prisma.crms_leads.findMany({
      where: {
        ...(startMoment &&
          endMoment && {
            createdate: {
              gte: startMoment.toDate(),
              lte: endMoment.toDate(),
            },
          }),
      },

      // ...(filterDays?.lostDealFilter && {pipelineId :Number(filterDays?.lostDealFilter)})},
      include: {
        crms_m_sources: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const sourceMap = new Map();
    deal2.forEach((deal) => {
      const sourceName = deal.crms_m_sources?.name || "Unknown";

      if (sourceMap.has(sourceName)) {
        sourceMap.get(sourceName).count += 1;
      } else {
        sourceMap.set(sourceName, { source: sourceName, count: 1 });
      }
    });

    // Convert Map to Array
    const stageSummary = Array.from(sourceMap.values());
    const deal3 = await prisma.crms_leads.findMany({
      // where: {
      //   createdate: {
      //     gte: startMoment2.toDate(),
      //     lte: endMoment2.toDate(),
      //   },
      // },

      // ...(filterDays?.lostDealFilter && {pipelineId :Number(filterDays?.lostDealFilter)})},
      include: {
        crms_m_lost_reasons: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const StatusMap = new Map();
    deal3.forEach((deal) => {
      const sourceName = deal.crms_m_lost_reasons?.name || "Unknown";

      if (StatusMap.has(sourceName)) {
        StatusMap.get(sourceName).count += 1;
      } else {
        StatusMap.set(sourceName, { source: sourceName, count: 1 });
      }
    });

    // Convert Map to Array
    const statusSummary = Array.from(StatusMap.values());

    return {
      leads: leads,
      leadSources: stageSummary,
      monthlyLeads: monthlyCreatedLeads,
      wonLeads: wonLeads,
      LostLeads: lostLeads,
      leadByStatus: statusSummary,
    };
  } catch (error) {
    console.log("Lead Dashboard getting error : ", error);
    throw new CustomError("Error retrieving Lead dashboard", 503);
  }
};
module.exports = {
  findDealById,
  getLeadDashboardData,
};

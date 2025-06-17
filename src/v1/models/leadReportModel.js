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
const findLeadById = async (id) => {
  try {
    const deal = await prisma.crms_leads.findUnique({
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
const getLeadReport = async (filterDays) => {
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
    const lead = await prisma.crms_leads.findMany({
      where: {
        createdate: {
          gte: startMoment.toDate(), // Get deals from the selected range
          lte: endMoment.toDate(), // Get deals from the last `filterDays`
        },
      },
      include: {
        crms_m_user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
          },
        },
        crms_m_lost_reasons: {
          select: {
            id: true,
            name: true,
            colorCode: true,
          },
        },
        crms_m_sources: {
          select: {
            id: true,
            name: true,
          },
        },
        crms_m_industries: {
          select: {
            id: true,
            name: true,
          },
        },
        lead_company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        lead_Country: {
          select: { id: true, name: true, code: true },
        },
        lead_State: {
          select: { id: true, name: true },
        },
      },

      orderBy: [{ updatedate: "desc" }, { createdate: "desc" }],
    });

    const deal1 = await prisma.crms_leads.findMany({
      where: {
        ...(yearFilter && {
          createdate: {
            gte: new Date(`${yearFilter}-01-01T00:00:00.000Z`),
            lt: new Date(`${Number(yearFilter) + 1}-01-01T00:00:00.000Z`),
          },
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
        createdate: {
          gte: startMoment2.toDate(),
          lte: endMoment2.toDate(),
        },
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

    return {
      lead: lead,
      LeadBySource: stageSummary,
      monthlyLeads: monthlyCreatedLeads,
    };
  } catch (error) {
    console.log("lead getting error : ", error);
    throw new CustomError("Error retrieving lead", 503);
  }
};
module.exports = {
  findLeadById,
  getLeadReport,
};

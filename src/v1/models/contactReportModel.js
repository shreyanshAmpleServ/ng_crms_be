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
const findContactById = async (id) => {
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
const getContactReport = async (filterDays) => {
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
    const contacts = await prisma.crms_m_contact.findMany({
      where: {
        createdate: {
          gte: startMoment.toDate(), // Get deals from the selected range
          lte: endMoment.toDate(), // Get deals from the last `filterDays`
        },
      },
      include: {
        company_details: true,
        owner_details: true,
        deal_details: true,
        source_details: true,
        industry_details: true,
        contact_State: {
          select: {
            id: true,
            name: true,
          },
        },
        contact_Country: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },

      orderBy: [{ updatedate: "desc" }, { createdate: "desc" }],
    });

    const contact1 = await prisma.crms_m_contact.findMany({
      where: {
        ...(yearFilter && {
          createdate: {
            gte: new Date(`${yearFilter}-01-01T00:00:00.000Z`),
            lt: new Date(`${Number(yearFilter) + 1}-01-01T00:00:00.000Z`),
          },
        }),
      },
    });
    const monthlyCreatedContact = {};

    contact1.forEach((data) => {
      const createdMonth = new Date(data.createdate).getMonth() + 1; // 1-12

      if (!monthlyCreatedContact[createdMonth]) {
        monthlyCreatedContact[createdMonth] = 0;
      }

      monthlyCreatedContact[createdMonth] += 1;
    });
    const contact2 = await prisma.crms_m_contact.findMany({
      where: {
        createdate: {
          gte: startMoment2.toDate(),
          lte: endMoment2.toDate(),
        },
      },

      // ...(filterDays?.lostDealFilter && {pipelineId :Number(filterDays?.lostDealFilter)})},
      include: {
        source_details: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    const sourceMap = new Map();

    contact2.forEach((deal) => {
      const sourceName = deal.source_details?.name || "Unknown";

      if (sourceMap.has(sourceName)) {
        sourceMap.get(sourceName).count += 1;
      } else {
        sourceMap.set(sourceName, { source: sourceName, count: 1 });
      }
    });

    // Convert Map to Array
    const stageSummary = Array.from(sourceMap.values());

    return {
      contacts: contacts,
      SourceByContact: stageSummary,
      monthlyContact: monthlyCreatedContact,
    };
  } catch (error) {
    console.log("Contact getting error : ", error);
    throw new CustomError("Error retrieving lead", 503);
  }
};
module.exports = {
  findContactById,
  getContactReport,
};

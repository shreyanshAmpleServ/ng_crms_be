const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");

// Create a new state
const createState = async (data) => {
  try {
    const state = await prisma.crms_m_states.create({
      data: {
        ...data,
        is_active: data.is_active || "Y",
        createdby: data.createdby || 1,
        log_inst: data.log_inst || 1,
      },
      include: {
        country_details: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
    return state;
  } catch (error) {
    throw new CustomError(`Error creating state: ${error.message}`, 500);
  }
};

// Find a state by ID
const findStateById = async (id) => {
  try {
    const state = await prisma.crms_m_states.findUnique({
      where: { id: parseInt(id) },
      include: {
        country_details: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
    if (!state) {
      throw new CustomError("State not found", 404);
    }
    return state;
  } catch (error) {
    throw new CustomError(`Error finding state by ID: ${error.message}`, 503);
  }
};

// Update a state
const updateState = async (id, data) => {
  try {
    const updatedState = await prisma.crms_m_states.update({
      where: { id: parseInt(id) },
      include: {
        country_details: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      data: {
        ...data,
        updatedate: new Date(),
      },
    });
    return updatedState;
  } catch (error) {
    throw new CustomError(`Error updating state: ${error.message}`, 500);
  }
};

// Delete a state
const deleteState = async (id) => {
  try {
    await prisma.crms_m_states.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    throw new CustomError(`Error deleting state: ${error.message}`, 500);
  }
};

// Get all states
const getAllStates = async (search, page, size, country_id) => {
  try {
    page = !page || page == 0 ? 1 : page;
    size = size || 10;
    const skip = (page - 1) * size || 0;

    const filters = {};
    if (search) {
      filters.name = { contains: search.toLowerCase() };
    }
    if (country_id) {
      filters.country_code = { equals: Number(country_id) };
    }
    const states = await prisma.crms_m_states.findMany({
      where: filters,
      skip: skip,
      take: size,
      include: {
        country_details: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: [
        { name: "asc" },
        // { updatedate: 'desc' },
        // { createdate: 'desc' },
      ],
    });
    const totalCount = await prisma.crms_m_states.count({
      where: filters,
    });

    return {
      data: states,
      currentPage: page,
      size,
      totalPages: Math.ceil(totalCount / size),
      totalCount: totalCount,
    };
  } catch (error) {
    console.log(error);
    throw new CustomError("Error retrieving states", 503);
  }
};

module.exports = {
  createState,
  findStateById,
  updateState,
  deleteState,
  getAllStates,
};

const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");

// Create a new industry
const createIndustry = async (data) => {
  try {
    const industry = await prisma.Industries.create({
      data: {
        name: data.name,
        description: data.description || null,
        is_active: data.is_active || "Y",
        createdby: data.createdby || 1,
        log_inst: data.log_inst || 1,
      },
    });
    return industry;
  } catch (error) {
    throw new CustomError(`Error creating industry: ${error.message}`, 500);
  }
};

// Find an industry by ID
const findIndustryById = async (id) => {
  try {
    const industry = await prisma.Industries.findUnique({
      where: { id: parseInt(id) },
    });
    if (!industry) {
      throw new CustomError("Industry not found", 404);
    }
    return industry;
  } catch (error) {
    throw new CustomError(
      `Error finding industry by ID: ${error.message}`,
      503
    );
  }
};

// Update an industry
const updateIndustry = async (id, data) => {
  try {
    const updatedIndustry = await prisma.Industries.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updatedate: new Date(),
      },
    });
    return updatedIndustry;
  } catch (error) {
    throw new CustomError(`Error updating industry: ${error.message}`, 500);
  }
};

// Delete an industry
const deleteIndustry = async (id) => {
  try {
    await prisma.Industries.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    throw new CustomError(`Error deleting industry: ${error.message}`, 500);
  }
};

// Get all industries
const getAllIndustries = async () => {
  try {
    const industries = await prisma.Industries.findMany({
      orderBy: [{ updatedate: "desc" }, { createdate: "desc" }],
    });
    return industries;
  } catch (error) {
    throw new CustomError("Error retrieving industries", 503);
  }
};

module.exports = {
  createIndustry,
  findIndustryById,
  updateIndustry,
  deleteIndustry,
  getAllIndustries,
};

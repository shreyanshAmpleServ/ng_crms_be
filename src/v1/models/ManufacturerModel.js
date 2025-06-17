const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");

// Create a new manufacturer
const createManufacturer = async (data) => {
  try {
    const manufacturer = await prisma.crms_m_manufacturer.create({
      data: {
        name: data.name,
        // description: data.description || null,
        is_active: data.is_active || "Y",
        createdby: data.createdby || 1,
        log_inst: data.log_inst || 1,
      },
    });
    return manufacturer;
  } catch (error) {
    throw new CustomError(`Error creating manufacturer: ${error.message}`, 500);
  }
};

// Find an manufacturer by ID
const findManufacturerById = async (id) => {
  try {
    const manufacturer = await prisma.crms_m_manufacturer.findUnique({
      where: { id: parseInt(id) },
    });
    if (!manufacturer) {
      throw new CustomError("manufacturer not found", 404);
    }
    return manufacturer;
  } catch (error) {
    throw new CustomError(
      `Error finding manufacturer by ID: ${error.message}`,
      503
    );
  }
};

// Update an manufacturer
const updateManufacturer = async (id, data) => {
  try {
    const updatedmanufacturer = await prisma.crms_m_manufacturer.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updatedate: new Date(),
      },
    });
    return updatedmanufacturer;
  } catch (error) {
    throw new CustomError(`Error updating manufacturer: ${error.message}`, 500);
  }
};

// Delete an manufacturer
const deleteManufacturer = async (id) => {
  try {
    await prisma.crms_m_manufacturer.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    throw new CustomError(`Error deleting manufacturer: ${error.message}`, 500);
  }
};

// Get all industries
const getAllManufacturer = async (search, page, size) => {
  try {
    page = !page || page == 0 ? 1 : page;
    size = size || 10;
    const skip = (page - 1) * size || 0;

    const filters = {};
    if (search) {
      filters.name = { contains: search.toLowerCase() };
    }
    const manufacturers = await prisma.crms_m_manufacturer.findMany({
      where: filters,
      skip: skip,
      take: size,
      orderBy: [{ updatedate: "desc" }, { createdate: "desc" }],
    });
    const totalCount = await prisma.crms_m_manufacturer.count({
      where: filters,
    });
    return {
      data: manufacturers,
      currentPage: page,
      size,
      totalPages: Math.ceil(totalCount / size),
      totalCount: totalCount,
    };
  } catch (error) {
    throw new CustomError("Error retrieving manufacturers", 503);
  }
};

module.exports = {
  createManufacturer,
  findManufacturerById,
  updateManufacturer,
  deleteManufacturer,
  getAllManufacturer,
};

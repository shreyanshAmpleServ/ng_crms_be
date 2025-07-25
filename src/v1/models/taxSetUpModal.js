const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");

// Create a new tax
const createTaxSetup = async (data) => {
  try {
    const { validFrom, validTo } = data;

    if (validFrom && validTo && new Date(validTo) < new Date(validFrom)) {
      throw new CustomError(`Valid from  must be greater than or equal to valid to`, 400);
    }
    const tax = await prisma.crms_m_tax_setup.create({
      data: {
        ...data,
        account_id: Number(data?.account_id) || null,
        is_active: data.is_active || "Y",
        log_inst: data.log_inst || 1,
        createdate: new Date(),
        updatedate: new Date(),
        updatedby: data.createdby || 1,
        createdby: data.createdby || 1,
      },
    });
    return tax;
  } catch (error) {
    console.log("Error tax SetUp Modal Create : ", error);
    throw new CustomError(`Error creating tax: ${error.message}`, error.status ||  500);
  }
};

// Update a tax
const updateTaxSetup = async (id, data) => {
  try {
    const { validFrom, validTo } = data;

    if (validFrom && validTo && new Date(validTo) < new Date(validFrom)) {
      throw new CustomError("`validTo` must be greater than or equal to `validFrom`", 400);
    }
    const updatedTax = await prisma.crms_m_tax_setup.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        account_id: Number(data?.account_id),
        updatedate: new Date(),
        updatedby: data.updatedby || 1,
      },
    });

    return updatedTax;
  } catch (error) {
    console.log("tax Update error : ", error);
    throw new CustomError(`Error updating tax: ${error.message}`, 500);
  }
};

// Find a tax by ID and include role
const findTaxSetupById = async (id) => {
  try {
    const tax = await prisma.crms_m_tax_setup.findUnique({
      where: { id: parseInt(id) },
    });
    return tax;
  } catch (error) {
    console.log("Error in Details of tax ", error);
    throw new CustomError(`Error finding tax by ID: ${error.message}`, 503);
  }
};

// Delete a tax
const deleteSetup = async (id) => {
  try {
    await prisma.crms_m_tax_setup.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    throw new CustomError(`Error deleting tax: ${error.message}`, 500);
  }
};

// Get all taxs and include their roles
const getAllTaxSetup = async (is_active) => {
  try {
    const taxs = await prisma.crms_m_tax_setup.findMany({
      where:{is_active: is_active},
      orderBy: [{ updatedate: "desc" }, { createdate: "desc" }],
    });

    // Fetch roles for each tax
    return taxs;
  } catch (error) {
    throw new CustomError("Error retrieving Taxs", 503);
  }
};

module.exports = {
  createTaxSetup,
  findTaxSetupById,
  updateTaxSetup,
  deleteSetup,
  getAllTaxSetup,
};

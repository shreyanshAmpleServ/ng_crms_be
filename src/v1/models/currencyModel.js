// Currency Model
const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");

const createCurrency = async (data) => {
  try {
    if (data.is_default == "Y") {
      await prisma.Currency.updateMany({
        where: { is_default: "Y" },
        data: { is_default: "N" },
      });
    }
    const currency = await prisma.Currency.create({
      data: {
        name: data.name,
        icon: data.icon || null,
        is_default: data.is_default || false,
        code: data.code,
        is_active: data.is_active || "Y",
        createdby: data.createdby || 1,
        log_inst: data.log_inst || 1,
      },
    });
    return currency;
  } catch (error) {
    throw new CustomError(`Error creating currency: ${error.message}`, 500);
  }
};

const findCurrencyById = async (id) => {
  try {
    const currency = await prisma.Currency.findUnique({
      where: { id: parseInt(id) },
    });
    if (!currency) {
      throw new CustomError("Currency not found", 404);
    }
    return currency;
  } catch (error) {
    throw new CustomError(
      `Error finding currency by ID: ${error.message}`,
      503
    );
  }
};

const updateCurrency = async (id, data) => {
  try {
    if (data.is_default == "Y") {
      await prisma.Currency.updateMany({
        where: { is_default: "Y" },
        data: { is_default: "N" },
      });
    }
    const updatedCurrency = await prisma.Currency.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updatedate: new Date(),
      },
    });
    return updatedCurrency;
  } catch (error) {
    throw new CustomError(`Error updating currency: ${error.message}`, 500);
  }
};

const deleteCurrency = async (id) => {
  try {
    await prisma.Currency.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    throw new CustomError(`Error deleting currency: ${error.message}`, 500);
  }
};

const getAllCurrency = async (is_active) => {
  try {
    const Currency = await prisma.Currency.findMany({
      where:{is_active},
      orderBy: [{ updatedate: "desc" }, { createdate: "desc" }],
    });
    return Currency;
  } catch (error) {
    throw new CustomError("Error retrieving Currency", 503);
  }
};

module.exports = {
  createCurrency,
  findCurrencyById,
  updateCurrency,
  deleteCurrency,
  getAllCurrency,
};

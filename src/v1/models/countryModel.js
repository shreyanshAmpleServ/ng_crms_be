const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");

const createCountry = async (data) => {
  try {
    const country = await prisma.Country.create({
      data: {
        ...data,
        name: data.name,
        is_active: data.is_active || "Y",
        createdby: data.createdby || 1,
        log_inst: data.log_inst || 1,
        createdate: new Date(),
        updatedate: new Date(),
        updatedby: 1,
      },
    });
    return country;
  } catch (error) {
    console.log("Create Country ", error);
    throw new CustomError(`Error creating country: ${error.message}`, 500);
  }
};

const findCountryById = async (id) => {
  try {
    const country = await prisma.Country.findUnique({
      where: { id: parseInt(id) },
    });
    if (!country) {
      throw new CustomError("Country not found", 404);
    }
    return country;
  } catch (error) {
    console.log("Country By Id  ", error);
    throw new CustomError(`Error finding country by ID: ${error.message}`, 503);
  }
};

const updateCountry = async (id, data) => {
  try {
    const updatedCountry = await prisma.Country.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updatedate: new Date(),
      },
    });
    return updatedCountry;
  } catch (error) {
    throw new CustomError(`Error updating country: ${error.message}`, 500);
  }
};

const deleteCountry = async (id) => {
  try {
    await prisma.Country.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    throw new CustomError(`Error deleting country: ${error.message}`, 500);
  }
};

const getAllCountries = async () => {
  try {
    const countries = await prisma.Country.findMany({
      orderBy: [
        { name: "asc" },
        // { updatedate: 'desc' },
        // { createdate: 'desc' },
      ],
    });
    return countries;
  } catch (error) {
    console.log("Country ", error);
    throw new CustomError("Error retrieving countries", 503);
  }
};

module.exports = {
  createCountry,
  findCountryById,
  updateCountry,
  deleteCountry,
  getAllCountries,
};

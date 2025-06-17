const ManufacturerModel = require('../models/ManufacturerModel');

const createManufacturer = async (data) => {
    return await ManufacturerModel.createManufacturer(data);
};

const findManufacturerById = async (id) => {
    return await ManufacturerModel.findManufacturerById(id);
};

const updateManufacturer = async (id, data) => {
    return await ManufacturerModel.updateManufacturer(id, data);
};

const deleteManufacturer = async (id) => {
    return await ManufacturerModel.deleteManufacturer(id);
};

const getAllManufacturer = async (search,page,size) => {
    return await ManufacturerModel.getAllManufacturer(search,page,size);
};

module.exports = {
    createManufacturer,
    findManufacturerById,
    updateManufacturer,
    deleteManufacturer,
    getAllManufacturer,
};

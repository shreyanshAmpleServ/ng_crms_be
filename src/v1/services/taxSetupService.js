const taxSetUpModal = require('../models/taxSetUpModal');

const createTaxSetup = async (data) => {
    return await taxSetUpModal.createTaxSetup(data);
};

const findTaxSetupById = async (id) => {
    return await taxSetUpModal.findTaxSetupById(id);
};

const updateTaxSetup = async (id, data) => {
    return await taxSetUpModal.updateTaxSetup(id, data);
};

const deleteSetup = async (id) => {
    return await taxSetUpModal.deleteSetup(id);
};

const getAllTaxSetup = async (is_active) => {
    return await taxSetUpModal.getAllTaxSetup(is_active);
};

module.exports = {
    createTaxSetup,
    findTaxSetupById,
    updateTaxSetup,
    deleteSetup,
    getAllTaxSetup,
};

const lostReasonModel = require('../models/lostReasonModel');

const createLostReason = async (data) => {
    return await lostReasonModel.createLostReason(data);
};

const findLostReasonById = async (id) => {
    return await lostReasonModel.findLostReasonById(id);
};

const updateLostReason = async (id, data) => {
    return await lostReasonModel.updateLostReason(id, data);
};

const deleteLostReason = async (id) => {
    return await lostReasonModel.deleteLostReason(id);
};

const getAllLostReasons = async (is_active) => {
    return await lostReasonModel.getAllLostReasons(is_active);
};

module.exports = {
    createLostReason,
    findLostReasonById,
    updateLostReason,
    deleteLostReason,
    getAllLostReasons,
};

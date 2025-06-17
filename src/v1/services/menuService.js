const menuModel = require('../models/menuModel');

const createMenuData = async (data) => {
    return await menuModel.createMenuData(data);
};

const findMenuDataById = async (id) => {
    return await menuModel.findMenuDataById(id);
};

const updateMenuData = async (id, data) => {
    return await menuModel.updateMenuData(id, data);
};

const deleteMenuData = async (id) => {
    return await menuModel.deleteMenuData(id);
};

const getAllMenuData = async () => {
    return await menuModel.getAllMenuData();
};

module.exports = {
    createMenuData,
    findMenuDataById,
    updateMenuData,
    deleteMenuData,
    getAllMenuData,
};

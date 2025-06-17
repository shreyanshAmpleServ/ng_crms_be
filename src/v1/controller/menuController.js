const menuService = require('../services/menuService');
const CustomError = require('../../utils/CustomError');

const createMenuData = async (req, res, next) => {
    try {
        const callStatus = await menuService.createMenuData(req.body);
        res.status(201).success('Menu created successfully', callStatus);
    } catch (error) {
        next(error);
    }
};

const findMenuDataById = async (req, res, next) => {
    try {
        const callStatus = await menuService.findCallStatusById(req.params.id);
        if (!callStatus) throw new CustomError('Menu not found', 404);
        res.status(200).success(null, callStatus);
    } catch (error) {
        next(error);
    }
};

const updateMenuData = async (req, res, next) => {
    try {
        const callStatus = await menuService.updateMenuData(req.params.id, req.body);
        res.status(200).success('Menu updated successfully', callStatus);
    } catch (error) {
        next(error);
    }
};

const deleteMenuData = async (req, res, next) => {
    try {
        await menuService.deleteMenuData(req.params.id);
        res.status(200).success('Menu deleted successfully', null);
    } catch (error) {
        next(error);
    }
};

const getAllMenuData = async (req, res, next) => {
    try {
        const callStatuses = await menuService.getAllMenuData();
        res.status(200).success(null, callStatuses);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createMenuData,
    findMenuDataById,
    updateMenuData,
    deleteMenuData,
    getAllMenuData,

};

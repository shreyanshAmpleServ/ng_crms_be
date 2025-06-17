const ManufacturerService = require('../services/ManufacturerService');
const CustomError = require('../../utils/CustomError');

const createManufacturer = async (req, res, next) => {
    try {
        const category = await ManufacturerService.createManufacturer(req.body);
        res.status(201).success('category created successfully', category);
    } catch (error) {
        next(error);
    }
};

const findManufacturerById = async (req, res, next) => {
    try {
        const category = await ManufacturerService.findManufacturerById(req.params.id);
        if (!category) throw new CustomError('category not found', 404);
        res.status(200).success(null, category);
    } catch (error) {
        next(error);
    }
};

const updateManufacturer = async (req, res, next) => {
    try {
        const category = await ManufacturerService.updateManufacturer(req.params.id, req.body);
        res.status(200).success('category updated successfully', category);
    } catch (error) {
        next(error);
    }
};

const deleteManufacturer = async (req, res, next) => {
    try {
        await ManufacturerService.deleteManufacturer(req.params.id);
        res.status(200).success('category deleted successfully', null);
    } catch (error) {
        next(error);
    }
};

const getAllManufacturer = async (req, res, next) => {
    try {
        const {search,page,size} = req.query
        const categories = await ManufacturerService.getAllManufacturer(search,Number(page),Number(size));
        res.status(200).success(null, categories);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createManufacturer,
    findManufacturerById,
    updateManufacturer,
    deleteManufacturer,
    getAllManufacturer,
};

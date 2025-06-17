const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");

// Create a new menu
const createMenuData = async (data) => {
  try {
    const MenuData = await prisma.crms_menus.create({
      data: {
        name: data.name,
        description: data.description || null,
        is_active: data.is_active || "Y",
        createdby: data.createdby || 1,
        log_inst: data.log_inst || 1,
      },
    });
    return MenuData;
  } catch (error) {
    throw new CustomError(`Error creating menu: ${error.message}`, 500);
  }
};

// Find a menu by ID
const findMenuDataById = async (id) => {
  try {
    const MenuData = await prisma.crms_menus.findUnique({
      where: { id: parseInt(id) },
    });
    if (!MenuData) {
      throw new CustomError("Menu not found", 404);
    }
    return MenuData;
  } catch (error) {
    throw new CustomError(`Error finding menu by ID: ${error.message}`, 503);
  }
};

// Update a menu
const updateMenuData = async (id, data) => {
  try {
    const updatedMenuData = await prisma.crms_menus.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        updatedate: new Date(),
      },
    });
    return updatedMenuData;
  } catch (error) {
    throw new CustomError(`Error updating menu: ${error.message}`, 500);
  }
};

// Delete a menu
const deleteMenuData = async (id) => {
  try {
    await prisma.crms_menus.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    console.log("Error to delete menu", error);
    throw new CustomError(`Error deleting menu: ${error.message}`, 500);
  }
};

// Get all menues
const getAllMenuData = async () => {
  try {
    const menuData = await prisma.crms_menus.findMany();
    console.log("menuData", menuData);
    // Map to store each menu item with children
    const menuMap = new Map();

    // Initialize each item in map with all fields + empty children array
    menuData.forEach((item) => {
      menuMap.set(item.id, {
        ...item,
        children: [],
      });
    });

    const topLevelMenus = [];

    // Build the tree structure
    menuData.forEach((item) => {
      if (item.parent_menu_id) {
        const parent = menuMap.get(item.parent_menu_id);
        if (parent) {
          parent.children.push(menuMap.get(item.id));
        }
      } else {
        topLevelMenus.push(menuMap.get(item.id));
      }
    });

    // Recursive function to sort children by order_by
    const sortChildrenByOrder = (menus) => {
      menus.sort((a, b) => (a.order_by ?? 0) - (b.order_by ?? 0));
      menus.forEach((menu) => {
        if (menu.children && menu.children.length > 0) {
          sortChildrenByOrder(menu.children);
        }
      });
    };

    sortChildrenByOrder(topLevelMenus);

    return topLevelMenus;
  } catch (error) {
    console.log("Error retrieving menu data:", error);
    throw new CustomError("Error retrieving menu", 503);
  }
};

module.exports = {
  createMenuData,
  findMenuDataById,
  updateMenuData,
  deleteMenuData,
  getAllMenuData,
};

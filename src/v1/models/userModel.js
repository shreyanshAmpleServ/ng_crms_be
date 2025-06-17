const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");

// Helper function to define fields returned for a user
const getUserFields = (is_password = false) => ({
  id: true,
  username: true,
  email: true,
  password: is_password,
  full_name: true,
  phone: true,
  address: true,
  profile_img: true,
  is_active: true,
  createdate: true,
  updatedate: true,
});

const getRolePermission = async (role_id) => {
  if (!role_id) return null;
  const role = await prisma.crms_d_role_permissions.findFirst({
    where: { role_id },
    select: { permissions: true },
  });
  return role ? JSON.parse(role.permissions) : null;
};
// Common method to fetch a user with role name
const getUserWithRole = async (userId, is_password = false) => {
  const user = await prisma.crms_m_user.findUnique({
    where: { id: userId },
    select: {
      ...getUserFields(is_password),
      crms_d_user_role: {
        select: {
          crms_m_role: {
            select: { role_name: true, id: true },
          },
        },
      },
    },
  });

  if (!user) throw new CustomError("User not found", 404);

  const roleId = user?.crms_d_user_role?.[0]?.crms_m_role?.id || null;
  const permission = roleId ? await getRolePermission(roleId) : null;
  // console.log("Fetching permissions" ,roleId,JSON.parse(permission?.permissions))

  return {
    ...user,
    role: user.crms_d_user_role?.[0]?.crms_m_role?.role_name || null,
    permissions: permission || null,
    role_id: user.crms_d_user_role?.[0]?.crms_m_role?.id || null,
  };
};

// Create a new user with role
const createUser = async (data) => {
  try {
    // Create the user
    const user = await prisma.crms_m_user.create({
      data: {
        username: data.username,
        password: data.password,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        address: data.address,
        profile_img: data.profile_img,
        is_active: data.is_active || "Y",
        log_inst: data.log_inst || 1,
        createdate: new Date(),
        createdby: data.createdby || 1,
      },
    });

    // Associate the user with a role
    if (data.role_id) {
      await prisma.crms_d_user_role.create({
        data: {
          user_id: user.id,
          role_id: data.role_id,
          is_active: "Y",
          log_inst: 1,
          createdate: new Date(),
          createdby: data.createdby || 1,
        },
      });
    }

    // Return the user with their role
    return await getUserWithRole(user.id);
  } catch (error) {
    console.log(error);
    throw new CustomError(`Error creating user: ${error.message}`, 500);
  }
};

// Update a user and their role
const updateUser = async (id, data) => {
  try {
    // Create the data object conditionally including password
    const updateData = {
      username: data.username,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      address: data.address,
      profile_img: data.profile_img,
      is_active: data.is_active,
      updatedate: new Date(),
    };

    // Include password only if it exists
    if (data.password) {
      updateData.password = data.password;
    }
    // Update user fields
    const updatedUser = await prisma.crms_m_user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    // Handle role switching
    if (data.role_id) {
      // Remove any existing roles for the user
      await prisma.crms_d_user_role.deleteMany({
        where: { user_id: updatedUser.id },
      });

      // Assign the new role to the user
      await prisma.crms_d_user_role.create({
        data: {
          user_id: updatedUser.id,
          role_id: data.role_id,
          is_active: "Y",
          log_inst: 1,
          createdate: new Date(),
          createdby: data.updatedby || 1,
        },
      });
    }

    // Return the updated user with their role
    return await getUserWithRole(updatedUser.id);
  } catch (error) {
    console.log(error);
    throw new CustomError(`Error updating user: ${error.message}`, 500);
  }
};

// Find a user by email and include role
const findUserByEmail = async (email) => {
  try {
    const user = await prisma.crms_m_user.findFirst({
      where: { email },
    });

    if (!user) throw new CustomError("User not found", 404);

    return await getUserWithRole(user.id, true);
  } catch (error) {
    if (error instanceof CustomError) {
      // Let known custom errors pass through
      throw error;
    }
    throw new CustomError(`Error : ${error.message}`, 503);
  }
};

// Find a user by ID and include role
const findUserById = async (id) => {
  try {
    return await getUserWithRole(parseInt(id));
  } catch (error) {
    throw new CustomError(`Error finding user by ID: ${error.message}`, 503);
  }
};

// Delete a user
const deleteUser = async (id) => {
  try {
    // Delete related records
    await prisma.crms_d_user_role.deleteMany({
      where: { user_id: parseInt(id) },
    });

    await prisma.crms_m_user.delete({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    throw new CustomError(`Error deleting user: ${error.message}`, 500);
  }
};

// Get all users and include their roles
const getAllUsers = async (search, page, size) => {
  try {
    page = page || 1;
    size = size || 10;
    const offset = (page - 1) * size;

    // Build dynamic WHERE condition
    let whereClause = '';
    let params = [];

    if (search) {
      whereClause = 'WHERE username LIKE @search';
      params.push({ name: 'search', value: `%${search}%` });
    }

    // Query for paginated data
    const usersList = await prisma.$queryRawUnsafe(`
      SELECT id,username,username as full_name,email
      FROM m_user_master
      ${whereClause}
      ORDER BY createdate DESC
      OFFSET ${offset} ROWS FETCH NEXT ${size} ROWS ONLY
    `, ...params.map(p => p.value));

    // Query for total count
    const totalCountResult = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*) as count
      FROM m_user_master
      ${whereClause}
    `, ...params.map(p => p.value));

    const totalCount = totalCountResult[0]?.count || 0;

    return {
      data: usersList,
      currentPage: page,
      size,
      totalPages: Math.ceil(totalCount / size),
      totalCount,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving users");
  }
};


module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  getAllUsers,
};

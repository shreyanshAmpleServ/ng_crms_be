const { PrismaClient } = require("@prisma/client");
const CustomError = require("../../utils/CustomError");
const prisma = require("../../utils/prismaClient");

// Create a new Order
const createOrder = async (orderData, orderItemsData) => {
  try {
    console.log("Modal of Create Order : ", orderData);
    const result = await prisma.$transaction(async (prisma) => {
      // Step 1: Create the Order
      const createdOrder = await prisma.crms_d_orders.create({
        data: {
          ...orderData,
          cust_id: Number(orderData?.cust_id) || null,
          currency: Number(orderData?.currency) || null,
          sales_type: Number(orderData?.sales_type) || null,
          rounding_amount: Number(orderData?.rounding_amount) || null,
          createdate: new Date(),
          updatedate: new Date(),
          updatedby: orderData.createdby || 1,
          updatedby: orderData.createdby || 1,

          // order_vendor: {
          //   connect: { id: Number(orderData?.cust_id) }, // ✅ Ensure it's properly connected
          // },
        },
      });
      // Step 2: Create OrderItems using the created order's ID
      const orderItems = await prisma.crms_d_order_items.createMany({
        data: orderItemsData.map((item) => ({
          ...item,
          item_id: Number(item?.item_id) || null,
          tax_id: Number(item?.tax_id) || null,
          parent_id: Number(createdOrder.id),
        })),
      });

      // Fetch the newly created order with associated data
      const orderWithDetails = await prisma.crms_d_orders.findUnique({
        where: { id: createdOrder.id },
        include: {
          order_items: true,
          order_vendor: {
            select: {
              id: true,
              name: true,
              email: true,
              billing_zipcode: true,
              billing_city: true,
              country: true,
              state: true,
              billing_street: true,
            },
          },
          order_currency: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });

      return orderWithDetails;
    });

    return result;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw new Error("Failed to create order and order items");
  }
};

// Update a Order
const updateOrder = async (orderId, orderData, orderItemsData) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Step 1: Update the Order
      const updatedOrder = await prisma.crms_d_orders.update({
        where: { id: Number(orderId) },
        data: {
          ...orderData,
          cust_id: orderData?.cust_id ? Number(orderData.cust_id) : null,
          currency: orderData?.currency ? Number(orderData.currency) : null,
          sales_type: orderData?.sales_type
            ? Number(orderData.sales_type)
            : null,
          rounding_amount: orderData?.rounding_amount
            ? Number(orderData.rounding_amount)
            : null,
          // due_date: orderData?.due_date ? due_date.toISOString() : "",
          // apr_date: orderData?.apr_date ? apr_date.toISOString() : "",
          updatedate: new Date(),
          updatedby: orderData?.updatedby || 1,
        },
      });

      // Step 2: Delete existing OrderItems for this order (if necessary)
      await prisma.crms_d_order_items.deleteMany({
        where: { parent_id: Number(orderId) },
      });

      // Step 3: Insert the updated OrderItems
      const orderItems = await prisma.crms_d_order_items.createMany({
        data: orderItemsData.map((item) => ({
          ...item,
          item_id: Number(item?.item_id) || null,
          tax_id: Number(item?.tax_id) || null,
          parent_id: Number(orderId),
        })),
      });

      // Fetch the newly created order with associated data
      const orderWithDetails = await prisma.crms_d_orders.findUnique({
        where: { id: updatedOrder.id },
        include: {
          order_items: true,
          order_vendor: {
            select: {
              id: true,
              name: true,
              email: true,
              billing_zipcode: true,
              billing_city: true,
              country: true,
              state: true,
              billing_street: true,
            },
          },
          order_currency: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });

      return orderWithDetails;
    });

    return result;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw new Error("Failed to update order and order items");
  }
};

// Find a Order by ID
const findOrderById = async (id) => {
  try {
    const users = await prisma.crms_d_orders.findUnique({
      where: { id: parseInt(id) },
      include: {
        order_items: true, // Include the related order items
        order_vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            billing_zipcode: true,
            billing_city: true,
            country: true,
            state: true,
            billing_street: true,
          },
        },
        order_currency: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
    return users;
  } catch (error) {
    console.log("Error in Details of Product ", error);
    throw new CustomError(`Error finding user by ID: ${error.message}`, 503);
  }
};

// Delete a Order
const deleteOrder = async (orderId) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Delete Order Items first
      await prisma.crms_d_order_items.deleteMany({
        where: { parent_id: Number(orderId) },
      });

      // Delete the Order
      const deletedOrder = await prisma.crms_d_orders.delete({
        where: { id: Number(orderId) },
      });

      return deletedOrder;
    });

    return result;
  } catch (error) {
    console.error("Failed to delete order and order items:", error);
    throw new Error("Failed to delete order and associated items");
  }
};
// Delete a Order
const syncToInvoice = async (orderId) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Delete Order Items first
      await prisma.crms_d_order_items.deleteMany({
        where: { parent_id: Number(orderId) },
      });

      // Delete the Order
      const deletedOrder = await prisma.crms_d_orders.delete({
        where: { id: Number(orderId) },
      });

      return deletedOrder;
    });

    return result;
  } catch (error) {
    console.error("Failed to delete order and order items:", error);
    throw new Error("Failed to delete order and associated items");
  }
};

const getAllOrder = async (search, page, size, startDate, endDate) => {
  try {
    page = page || 1;
    size = size || 10;
    const skip = (page - 1) * size;
    const filters = {};
    // Handle search
    if (search) {
      filters.OR = [
        {
          order_vendor: {
            name: { contains: search.toLowerCase() },
          },
        },
        {
          order_code: { contains: search.toLowerCase() },
        },
        {
          shipto: { contains: search.toLowerCase() },
        },
        {
          billto: { contains: search.toLowerCase() },
        },
        {
          cont_person: { contains: search.toLowerCase() },
        },
      ];
    }
    // Handle date filtering
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        filters.createdate = {
          gte: start,
          lte: end,
        };
      }
    }
    const orders = await prisma.crms_d_orders.findMany({
      where: filters,
      skip,
      take: size,
      include: {
        order_items: true, // Include the related order items
        order_vendor: {
          select: {
            id: true,
            name: true,
            email: true,
            billing_zipcode: true,
            billing_city: true,
            country: true,
            state: true,
            billing_street: true,
          },
        },
        order_currency: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: [{ updatedate: "desc" }, { createdate: "desc" }],
    });

    const totalCount = await prisma.crms_d_orders.count();

    return {
      data: orders,
      currentPage: page,
      size,
      totalPages: Math.ceil(totalCount / size),
      totalCount: totalCount,
    };
  } catch (error) {
    console.log("Error Order Modal : ", error);
    throw new CustomError("Error retrieving order", 503);
  }
};

// Get Sales Type
const getSalesType = async () => {
  try {
    const notes = await prisma.crms_d_sales_types.findMany();
    return notes;
  } catch (error) {
    throw new CustomError("Error retrieving Sales Type", 503);
  }
};
// Generate Order Code
const generateOrderCode = async () => {
  try {
    const latestOrder = await prisma.crms_d_orders.findFirst({
      orderBy: { id: "desc" },
    });
    const nextId = latestOrder ? latestOrder.id + 1 : 1;
    return `ORD-1${nextId}`;
  } catch (error) {
    console.log("Error to generation order code : ", error);
    throw new CustomError("Error retrieving oder code", 503);
  }
};

// const syncOrderToInvoice = async (orderId) => {
//   const order = await prisma.crms_d_orders.findUnique({
//     where: { id: Number(orderId) },
//     include: {
//       order_items: true,
//     },
//   });

//   if (!order) {
//     throw new Error(`Order with ID ${orderId} not found`);
//   }
//   return await prisma.$transaction(async (prisma) => {
//     const invoice = await prisma.crms_d_invoice.create({
//       data: {
//         cust_id: order.cust_id,
//         order_code: null,
//         address: order.address,
//         cust_ref_no: order.cust_ref_no,
//         cont_person: order.cont_person,
//         currency: order.currency,
//         due_date: order.due_date,
//         total_bef_tax: order.total_bef_tax,
//         disc_prcnt: order.disc_prcnt,
//         tax_total: order.tax_total,
//         doc_total: order.doc_total,
//         source_doc_id: `${order.id}`,
//         source_doc_type: "Order",
//         rounding: order.rounding,
//         remarks: order.remarks,
//         shipto: order.shipto,
//         billto: order.billto,
//         sales_type: order.sales_type,
//         apr_status: order.apr_status,
//         apr_by: order.apr_by,
//         apr_date: order.apr_date,
//         apr_remark: order.apr_remark,
//         auto_approved: order.auto_approved,
//         status: order.status,
//         createdby: order.createdby,
//         updatedby: order.updatedby,
//         createdate: new Date(),
//         updatedate: new Date(),
//         total_amount: order.total_amount,
//         rounding_amount: order.rounding_amount,
//         attachment1: order.attachment1,
//         attachment2: order.attachment2,
//       },
//     });

//     await prisma.crms_d_invoice_items.createMany({
//       data: order.order_items.map((item) => ({
//         item_id: item.item_id,
//         item_name: item.item_name,
//         quantity: item.quantity,
//         delivered_qty: item.delivered_qty,
//         unit_price: item.unit_price,
//         currency: item.currency,
//         rate: item.rate,
//         disc_prcnt: item.disc_prcnt,
//         tax_id: item.tax_id,
//         tax_per: item.tax_per,
//         line_tax: item.line_tax,
//         total_bef_disc: item.total_bef_disc,
//         total_amount: item.total_amount,
//         parent_id: invoice.id,
//         disc_amount: item.disc_amount,
//       })),
//     });

//     return invoice;
//   });
// };

const generateInvoiceCode = async () => {
  try {
    const latestInvoice = await prisma.crms_d_invoice.findFirst({
      orderBy: { id: "desc" },
    });
    const nextId = latestInvoice ? latestInvoice.id + 1 : 1;
    return `INV-00${nextId}`;
  } catch (error) {
    console.error("Error generating invoice code:", error);
    throw new Error("Error generating invoice code");
  }
};

const syncOrderToInvoice = async (orderId) => {
  const order = await prisma.crms_d_orders.findUnique({
    where: { id: Number(orderId) },
    include: {
      order_items: true,
    },
  });

  if (!order) {
    throw new Error(`Order with ID ${orderId} not found`);
  }

  return await prisma.$transaction(async (prisma) => {
    const invoiceCode = await generateInvoiceCode();

    // 1. Create the invoice with the generated code
    const invoice = await prisma.crms_d_invoice.create({
      data: {
        order_code: invoiceCode,
        cust_id: order.cust_id,
        address: order.address,
        cust_ref_no: order.cust_ref_no,
        cont_person: order.cont_person,
        currency: order.currency,
        due_date: order.due_date,
        total_bef_tax: order.total_bef_tax,
        disc_prcnt: order.disc_prcnt,
        tax_total: order.tax_total,
        doc_total: order.doc_total,
        source_doc_id: Number(orderId),
        source_doc_type: "Order",
        rounding: order.rounding,
        remarks: order.remarks,
        shipto: order.shipto,
        billto: order.billto,
        sales_type: order.sales_type,
        apr_status: order.apr_status,
        apr_by: order.apr_by,
        apr_date: order.apr_date,
        apr_remark: order.apr_remark,
        auto_approved: order.auto_approved,
        status: order.status,
        createdby: order.createdby,
        updatedby: order.updatedby,
        createdate: new Date(),
        updatedate: new Date(),
        total_amount: order.total_amount,
        rounding_amount: order.rounding_amount,
        attachment1: order.attachment1,
        attachment2: order.attachment2,
      },
    });

    // 2. Insert the invoice items
    await prisma.crms_d_invoice_items.createMany({
      data: order.order_items.map((item) => ({
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: item.quantity,
        delivered_qty: item.delivered_qty,
        unit_price: item.unit_price,
        currency: item.currency,
        rate: item.rate,
        disc_prcnt: item.disc_prcnt,
        tax_id: item.tax_id,
        tax_per: item.tax_per,
        line_tax: item.line_tax,
        total_bef_disc: item.total_bef_disc,
        total_amount: item.total_amount,
        parent_id: invoice.id,
        disc_amount: item.disc_amount,
      })),
    });

    // 3. ✅ Update order with the same code
    await prisma.crms_d_orders.update({
      where: { id: order.id },
      data: {
        order_code: invoiceCode,
      },
    });

    return invoice;
  });
};

module.exports = {
  createOrder,
  findOrderById,
  updateOrder,
  deleteOrder,
  getAllOrder,
  getSalesType,
  generateOrderCode,
  syncToInvoice,
  syncOrderToInvoice,
};

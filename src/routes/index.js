const express = require("express");
const authRoutesv1 = require("../v1/routes/authRoutes"); // Import version 1 routes
const contactRoute = require("../v1/routes/contactRoutes");
const dealRoute = require("../v1/routes/dealRoutes");
const companyRoute = require("../v1/routes/companyRoutes");
const pipelineRoute = require("../v1/routes/pipelineRoute");
const sourceRoute = require("../v1/routes/sourceRoute");
const callsRoutes = require("../v1/routes/callsRoute");
const callStatusRoutes = require("../v1/routes/callStatusRoute");
const callTypeRoutes = require("../v1/routes/callTypeRoute");
const callResultRoutes = require("../v1/routes/callResultRoute");
const callPurposeRoutes = require("../v1/routes/callPurposeRoute");
const contactStageRoutes = require("../v1/routes/contactStageRoute");
const industryRoutes = require("../v1/routes/industryRoute");
const lostReasonRoutes = require("../v1/routes/lostReasonRoute");
const projectRoutes = require("../v1/routes/projectRoutes");
const userRoutes = require("../v1/routes/userRoutes");
const roleRoutes = require("../v1/routes/roleRoute");
const leadRoutes = require("../v1/routes/leadRoutes");
const stateRoutes = require("../v1/routes/stateRoute");
const countryRoutes = require("../v1/routes/countryRoutes");
const currencyRoutes = require("../v1/routes/currencyRoutes");
const activitiesRoutes = require("../v1/routes/activitiesRoutes");
const noteRoutes = require("../v1/routes/noteRoute");
const dashboardRoutes = require("../v1/routes/dashboardRoutes");
const vendorRoutes = require("../v1/routes/vendorRoutes");
const meetingTypeRoutes = require("../v1/routes/meetingTypeRoute");
const mappedStateRoutes = require("../v1/routes/mappedStateRoute");
const modulesRoutes = require("../v1/routes/ModuleRoute");
const permissionsRoutes = require("../v1/routes/roleModulePermissionRoute");
const fileAttachmentRoutes = require("../v1/routes/fileAttachmentRoute");
const productCategoryRoutes = require("../v1/routes/productCategoryRoute");
const manufacturerRoutes = require("../v1/routes/manufacturerRoute");
const productRoutes = require("../v1/routes/productRoute");
const taxSetupRoutes = require("../v1/routes/taxSetupRoute");
const orderRoutes = require("../v1/routes/orderRoute");
const quotationRoutes = require("../v1/routes/quotationRoute");
const purchaseOrderRoutes = require("../v1/routes/purchaseOrderRoute");
const purchaseInvoiceRoutes = require("../v1/routes/purchaseInvoiceRoute");
const invoiceRoutes = require("../v1/routes/invoiceRoute");
const priceBookRoutes = require("../v1/routes/priceBookRoute");
const casesRoutes = require("../v1/routes/casesRoutes");
const solutionsRoutes = require("../v1/routes/solutionsRoutes");
const campaignRoutes = require("../v1/routes/campaignRoutes");
const dealReportRoutes = require("../v1/routes/dealReportRoutes");
const leadReportRoutes = require("../v1/routes/leadReportRoutes");
const contactReportRoutes = require("../v1/routes/contactReportRoutes");
const companyReportRoutes = require("../v1/routes/companyReportRoutes");
const projectReportRoutes = require("../v1/routes/projectReportRoutes");
const TaskReportRoutes = require("../v1/routes/TaskReportRoutes");
const menuRoute = require("../v1/routes/menuRoute");
const dashboardLeadRoutes = require("../v1/routes/dashboardLeadRoutes");
const redirectLoginRoute = require("../v1/routes/redirectLoginRoute");

const router = express.Router();

// Version 1 API
router.use("/v1", authRoutesv1); // Base path: /v1
router.use("/v1", dashboardRoutes); // Base path: /v1
router.use("/v1", contactRoute); // Base path: /v1
router.use("/v1", vendorRoutes); // Base path: /v1
router.use("/v1", dealRoute); // Base path: /v1
router.use("/v1", companyRoute); // Base path: /v1
router.use("/v1", pipelineRoute); // Base path: /v1
router.use("/v1", pipelineRoute); // Base path: /v1
router.use("/v1", sourceRoute); // Base path: /v1
router.use("/v1", callsRoutes); // Base path: /v1
router.use("/v1", callStatusRoutes); // Base path: /v1
router.use("/v1", callTypeRoutes); // Base path: /v1
router.use("/v1", callResultRoutes); // Base path: /v1
router.use("/v1", callPurposeRoutes); // Base path: /v1
router.use("/v1", contactStageRoutes); // Base path: /v1
router.use("/v1", industryRoutes); // Base path: /v1
router.use("/v1", lostReasonRoutes); // Base path: /v1
router.use("/v1", projectRoutes);
router.use("/v1", userRoutes);
router.use("/v1", roleRoutes);
router.use("/v1", leadRoutes);
router.use("/v1", stateRoutes);
router.use("/v1", countryRoutes);
router.use("/v1", currencyRoutes);
router.use("/v1", activitiesRoutes);
router.use("/v1", noteRoutes);
router.use("/v1", meetingTypeRoutes);
router.use("/v1", mappedStateRoutes);
router.use("/v1", modulesRoutes);
router.use("/v1", permissionsRoutes);
router.use("/v1", fileAttachmentRoutes);
router.use("/v1", productCategoryRoutes);
router.use("/v1", manufacturerRoutes);
router.use("/v1", productRoutes);
router.use("/v1", taxSetupRoutes);
router.use("/v1", orderRoutes);
router.use("/v1", quotationRoutes);
router.use("/v1", purchaseOrderRoutes);
router.use("/v1", purchaseInvoiceRoutes);
router.use("/v1", invoiceRoutes);
router.use("/v1", priceBookRoutes);
router.use("/v1", casesRoutes);
router.use("/v1", solutionsRoutes);
router.use("/v1", campaignRoutes);
router.use("/v1", dealReportRoutes);
router.use("/v1", leadReportRoutes);
router.use("/v1", contactReportRoutes);
router.use("/v1", companyReportRoutes);
router.use("/v1", projectReportRoutes);
router.use("/v1", TaskReportRoutes);
router.use("/v1", menuRoute);
router.use("/v1", dashboardLeadRoutes);
router.use("/v1", redirectLoginRoute);

// Add future versions here
// Example: router.use('/v2', v2Routes);

module.exports = router;

const verifyToken = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController")
const commodityController = require("../controllers/commodityController");

// Authentication middleware to secure these routes
router.use(verifyToken);

// Both users and admins can create a new farmer and read the list of farmers
router.post("/company", companyController.createCompany);
router.put("/company", companyController.updateCompany);
router.get("/company", companyController.getCompanies);
router.get("/company/one", companyController.getCompany);

router.post("/commodity", commodityController.createCommodity);
router.put("/commodity", commodityController.updateCommodity);
router.get("/commodity", commodityController.getCommodities);
router.get("/commodity/one", commodityController.getCommodity);


module.exports = router;

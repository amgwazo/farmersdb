// routes/farmer.js
const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/farmerController");
const purchaseController = require("../controllers/commodityPurchases");
const verifyToken = require("../middleware/auth");

// Authentication middleware to secure these routes
router.use(verifyToken);

// Both users and admins can create a new farmer and read the list of farmers
router.post("/", farmerController.createFarmer);
router.post("/purchase/create", purchaseController.createPurchase);
router.get("/purchases", purchaseController.searchPurchases)

// Route for bulk insert of farmers
router.post('/farmers', farmerController.bulkInsertFarmers);

router.get("/", farmerController.getFilteredFarmer);
router.get("/:nationalId", farmerController.getFarmerByNationalId);
router.get("/filtered/farmer", farmerController.getFilteredFarmer);

// Only admins can update and delete farmers. The logic for this is in the controller
router.put("/", farmerController.updateFarmer);
router.delete("/delete/:farmerId", farmerController.deleteFarmer);

module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/auth");


router.post("/login", authController.login);

// Authentication middleware to secure these routes
router.use(verifyToken);

router.post("/register", authController.register);
router.put("/update/user", authController.updateUser);
router.get("/all/users", authController.getAllUsers);
router.get("/user", authController.getUser);
router.get("/filtered/users", authController.getFilteredUser);

module.exports = router;

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/auth");
const verifyToken = require("./src/middleware/auth");
const farmerRoutes = require("./src/routes/farmer");
const cors = require("cors");



const app = express();

app.use(cors());
const PORT = process.env.PORT || 3005;

dotenv.config();
require("./src/config/db");

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/farmer", farmerRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const Commodity = require("../models/Commodity");
const { Types } = require("mongoose");

const createCommodity = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCommodity = await Commodity.findOne({ name });

    if (existingCommodity) {
      return res.status(400).json({ message: "Commodity already exists" });
    }

    const newCommodity = new Commodity({
      name
    });

    await newCommodity.save();

    res.status(201).json({ message: "New Commodity Setup successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCommodities = async (req, res) => {
  try {
    const commodities = await Commodity.find();
    res.status(200).json(commodities);
  } catch (error) {
    console.error("Error getting commodities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCommodity = async (req, res) => {
  const { searchTerm } = req.query;

  // Only allow admins to update farmers
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({ message: "Permission denied" });
  // }

  try {
    let commodity;

    // Check if the searchTerm is a valid ObjectId
    if (Types.ObjectId.isValid(searchTerm)) {
      // If valid, search by _id directly
      commodity = await Commodity.findOne({ _id: searchTerm });
    } else {
      // Otherwise, search by Company name
      commodity = await Commodity.findOne({ name: searchTerm });
    }

    if (!commodity) {
      return res.status(404).json({ message: "Commodity not found" });
    }

    res.status(200).json(commodity);
  } catch (error) {
    console.error("Error getting commodity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCommodity = async (req, res) => {
  const { _id } = req.query;
  const { name } = req.body;
  try {
    // Check if the new username already exists
    const existingCommodity = await Commodity.findOne({ name });

    if (existingCommodity) {
      return res.status(400).json({ message: "Commodity already exists" });
    }

    // Update the user
    const updatedCommodity = await Commodity.findByIdAndUpdate(
      _id,
      { name },
      { new: true }
    );

    if (!updatedCommodity) {
      return res.status(404).json({ message: "Commodity not found" });
    }

    res.status(200).json(updatedCommodity);
  } catch (error) {
    console.error("Error updating commodity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
   createCommodity,
   getCommodities,
   getCommodity,
   updateCommodity,
};

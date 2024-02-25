const Company = require("../models/Company");
const { Types } = require("mongoose");


const createCompany = async (req, res) => {
  try {
    const { name, allowedCommodities } = req.body;

    const existingCompany = await Company.findOne({ name });

    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists" });
    }
 
    const newCompany = new Company({
      name,
      allowedCommodities
    });

    await newCompany.save();

    res.status(201).json({ message: "New Company Setup successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error getting companies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCompany = async (req, res) => {
  const { searchTerm } = req.query;

  // Only allow admins to update farmers
  // if (req.user.role !== "admin") {
  //   return res.status(403).json({ message: "Permission denied" });
  // }

  try {
    let company;

    // Check if the searchTerm is a valid ObjectId
    if (Types.ObjectId.isValid(searchTerm)) {
      // If valid, search by _id directly
      company = await Company.findOne({ _id: searchTerm });
    } else {
      // Otherwise, search by Company name 
      company = await Company.findOne({ name: searchTerm });
    }

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Error getting company:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateCompany = async (req, res) => {
  const { _id } = req.query;
  const { name,  allowedCommodities } = req.body;
  try {
    // Check if the new username already exists
    const existingCompany = await Company.findOne({ name });

    if (existingCompany) {
      return res.status(400).json({ message: "Company already exists" });
    }

    // Update the user
    const updatedCompany = await Company.findByIdAndUpdate(
      _id,
      { name, allowedCommodities },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = {
    createCompany,
    getCompanies,
    getCompany,
    updateCompany

}
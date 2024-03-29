const { Types } = require("mongoose");
const Farmer = require("../models/Farmer");

const { v4: uuidv4 } = require("uuid");
const { strToNumConverter } = require("../helpers/strToNumConverter.Js");

const createFarmer = async (req, res) => {
  try {
    const {firstName, lastName, nationalId, dob, gender, year,
       loanAmount
       } = req.body;

      const company = req.user.company;
      const capturedBy = req.user.username;
      const companyId = req.user.companyId 

      
  const currentDate = new Date();
  currentDate.setUTCHours(currentDate.getUTCHours() + 2);


    // Validate national ID format (000000/00/0)
    const nationalIdRegex = /^\d{6}\/\d{2}\/\d{1}$/;

    if (!nationalIdRegex.test(nationalId)) {
      return res.status(400).json({ error: "Invalid national ID format" });
    }

    const unFormattedLoanAmount = strToNumConverter(loanAmount);

    const newFarmer = new Farmer({
      company,
      firstName,
      lastName,
      nationalId,
      dob,
      gender,
      year,
      loanAmount: unFormattedLoanAmount,
      loanBalance: unFormattedLoanAmount,
      companyId,
      capturedBy,
      lastModifiedBy: capturedBy,
      creationDate: currentDate.getTime(),
      updatedDate: currentDate.getTime(),
    });

    await newFarmer.save();

    res.status(201).json({ message: "Farmer created successfully" });
  } catch (error) {
    console.error(error);

    // Handle duplicate error cases
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.nationalId
    ) {
      // Duplicate national ID error
      return res.status(400).json({ error: "National ID already exists" });
    }

    if (error.name === "ValidationError") {
      // Mongoose validation error (e.g., invalid date format)
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ error: "Validation error", errors: errorMessages });
    }

    // General internal server error
    res.status(500).json({ error: "Internal server error" });
  }
};





const validateNationalId = (nationalId) => {
  const nationalIdRegex = /^\d{6}\/\d{2}\/\d{1}$/;
  return nationalIdRegex.test(nationalId);
};

const bulkInsertFarmers = async (req, res) => {
  
  let resultsArray;
  const farmersToInsert = req.body;
   
  const batchNumber = uuidv4();

  

  const company = req.user.company;
  const capturedBy = req.user.username;
  const currentDate = new Date();
  currentDate.setUTCHours(currentDate.getUTCHours() + 2);

  
  try {

    farmersToInsert.forEach((obj) => {
      obj.updatedDate = currentDate.getTime();
      obj.creationDate = currentDate.getTime();
      obj.capturedBy = capturedBy;
      obj.lastModifiedBy = capturedBy;
      obj.company = company;
      obj.batchNumber = batchNumber;

      let existingDate = new Date(obj.dob);
      existingDate.setUTCHours(existingDate.getUTCHours() + 2);
      obj.dob = existingDate.getTime();
    });

    

    // Validate national IDs before insertion
    const invalidNationalIds = farmersToInsert.filter((farmer) => !validateNationalId(farmer.nationalId));

    // if (invalidNationalIds.length > 0) {
    //   return res.status(400).json({
    //     message: 'Validation error',
    //     errors: invalidNationalIds.map((farmer) => ({
    //       index: farmersToInsert.indexOf(farmer),
    //       error: 'Invalid national ID format',
    //     })),
    //   });
    // }

     if (invalidNationalIds.length > 0) {
       return res.status(400).json({
         message: "Validation error",
         errors: invalidNationalIds.map((farmer) => ({
           nationalId: farmer.nationalId,
           firstName: farmer.firstName,
           lastName: farmer.lastName,           
           error: "Invalid national ID format",
        //    farmer: farmer,
         })),
       });
     }

    // Perform bulk insert with ordered set to false
    const result = await Farmer.insertMany(farmersToInsert, { ordered: false });

    // Create a Map to efficiently track successfully inserted farmers
    const successfullyInsertedMap = new Map(result.map((doc) => [doc.nationalId, doc]));

    // Create a new array to store the results
    resultsArray = farmersToInsert.map((farmer) => {
      const status = successfullyInsertedMap.has(farmer.nationalId) ? 'SUCCESS' : 'FAILURE';
      return { ...farmer, status };
    });

    // Check if there are any failed farmers
    const failedFarmers = resultsArray.filter((result) => result.status === 'FAILURE');
   
    if (failedFarmers.length === 0) {
      return res.status(200).json({ message: 'Bulk insert successful', results: resultsArray });
    }

    // Format the failed farmers array to include reasons for failure
    const formattedFailedFarmers = failedFarmers.map((failure) => {
    //   const index = farmersToInsert.findIndex((farmer) => farmer.nationalId === failure.nationalId);
    //   const { firstName, lastName, nationalId, dob, gender, year, companyId } = farmersToInsert[index];
    const { company, firstName, lastName, nationalId, dob, gender, year, companyId, loanAmount } = failure;
      return {
        details: {company, firstName, lastName, nationalId, dob, gender, year, companyId, loanAmount },
        // index,
      };
    });

    return res.status(400).json({
      message: 'Bulk insert partially successful',
      results: resultsArray,
      failedFarmers: formattedFailedFarmers,
    });
  } catch (error) {
    console.error(error);

    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation error', errors: errorMessages });
    }

    // if (error.writeErrors && error.writeErrors.length > 0) {
    //   const formattedFailedFarmers = error.writeErrors.map((writeError) => {
    //     return {
    //       index: writeError.index,
    //     };
    //   });

    //   return res.status(400).json({
    //     message: 'Bulk insert partially successful',
    //     results: resultsArray,
    //     failedFarmers: formattedFailedFarmers,
    //   });
    // }
 if (error.writeErrors && error.writeErrors.length > 0) {
   // Modify this block to return a list of failed farmers with failure reasons
   const formattedFailedFarmers = error.writeErrors.map((writeError) => {
     const { index } = writeError;
     const { firstName, lastName, nationalId, dob, gender, year, companyId } =
       farmersToInsert[index];

     // Get the specific error reason for this farmer     
     
    //  const errorReason = writeError.errmsg || "Unknown error";
    const errorReason = writeError.errmsg;


     return {
       company,
         firstName,
         lastName,
         nationalId,
         dob,
         gender,
         year,
         companyId,
        //  index,
         errorReason,
      
     };
   });

   return res.status(400).json({
     message: "Bulk insert partially successful",
     results: resultsArray,
     failedFarmers: formattedFailedFarmers,
   });
 }


    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


const getFarmers = async (req, res) => {
  try {
    // Retrieve and return the list of farmers (both users and admins can access this)
    const farmers = await Farmer.find();
    res.status(200).json(farmers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getFarmerByNationalId = async (req, res) => {
  try {
    // Retrieve the farmer based on the provided national ID (both users and admins can access this)
    const { nationalId } = req.params;

    const farmer = await Farmer.findOne({ nationalId });

    if (!farmer) {
      return res.status(404).json({ message: "Farmer National ID not found" });
    }

    res.status(200).json(farmer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getFilteredFarmer = async (req, res) => {
  const { searchTerm } = req.query;
  const companyId = req.user.companyId;

  try {
    let farmer;

    // Get all farmers
    if (!searchTerm) {
      // Check if the user is allowed to view transactions for other companies
      if (companyId === "65d8856b66e46951155bf6b4") {
        farmer = await Farmer.find();
      } else {
        farmer = await Farmer.find({ companyId: companyId });
      }
    }

    // Check if the searchTerm is a valid ObjectId
    else if (Types.ObjectId.isValid(searchTerm)) {
      // If valid, search by _id directly
      farmer = await Farmer.findOne({ _id: searchTerm, companyId: companyId });
    } else {
      // Otherwise, search by first name or last name or national id
      // and filter by companyId if user is not allowed to view transactions for other companies
      if (companyId === "65d8856b66e46951155bf6b4") {
        farmer = await Farmer.find({
          $or: [
            { firstName: searchTerm },
            { lastName: searchTerm },
            { nationalId: searchTerm },
          ],
        });
      } else {
        farmer = await Farmer.find({
          $and: [
            {
              $or: [
                { firstName: searchTerm },
                { lastName: searchTerm },
                { nationalId: searchTerm },
              ],
            },
            { companyId: companyId },
          ],
        });
      }
    }

    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found " });
    }

    res.status(200).json(farmer);
  } catch (error) {
    console.error("Error getting Farmer:", error);
    res.status(500).json({ message: "Internal server errors" });
  }
};




const updateFarmer = async (req, res) => {
  try {
    // Only allow admins to update farmers
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Update the farmer based on the provided information
    const { _id } = req.query;
    const {
      company,
      firstName,
      lastName,
      nationalId,
      dob,
      gender,
      year,
      loanAmount,
      companyId,
      capturedBy,
    } = req.body;

    const unFormattedLoanAmount = strToNumConverter(loanAmount);

  //   // Remove commas from the loanAmount value
  //  let unformattedLoanAmount = req.body.loanAmount.replace(/,/g, "");

  //   // Parse the loanAmount value into a number
  //    unformattedLoanAmount = parseFloat(loanAmount);

    const lastModifiedBy = req.user.username;

    const updatedDate = new Date();

    // Validate national ID format (000000/00/0)
    const nationalIdRegex = /^\d{6}\/\d{2}\/\d{1}$/;

    if (!nationalIdRegex.test(nationalId)) {
      return res.status(400).json({ error: "Invalid national ID format" });
    }

    // // Check if the updated national ID already exists
    // const existingFarmer = await Farmer.findOne({
    //   nationalId: nationalId,
    //   _id: { $ne: _id },
    // });

    // if (existingFarmer) {
    //   return res.status(400).json({ message: "National ID already exists" });
    // }

    const updatedFarmer = await Farmer.findByIdAndUpdate(
      _id,
      {
        company,
        firstName,
        lastName,
        nationalId,
        dob,
        gender,
        year,
        loanAmount: unFormattedLoanAmount,
        companyId: req.user.companyId,
        capturedBy,
        lastModifiedBy,
        updatedDate,
      },
      { new: true, runValidators: true }
    );

    // const updatedFarmer = await Farmer.findOneAndUpdate(
    //   { nationalId: nationalId },
    //   { $set: { firstName, lastName, nationalId, dob, gender } },
    //   { new: true }
    // );

    if (!updatedFarmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    res
      .status(200)
      .json({ message: "Farmer updated successfully", farmer: updatedFarmer });
  } catch (error) {
    console.error(error);

    // Handle duplicate error cases
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.nationalId
    ) {
      // Duplicate national ID error
      return res.status(400).json({ message: "National ID already exists" });
    }

    // Handle specific error cases
    if (error.name === "ValidationError") {
      // Mongoose validation error (e.g., invalid date format)
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({ message: "Validation error", errors: errorMessages });
    }

    // General internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteFarmer = async (req, res) => {
  try {
    // Only allow admins to delete farmers
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Delete the farmer based on the provided farmerId
    const { farmerId } = req.params;

    const deletedFarmer = await Farmer.findByIdAndDelete(farmerId);

    if (!deletedFarmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    res
      .status(200)
      .json({ message: "Farmer deleted successfully", farmer: deletedFarmer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createFarmer,
  getFarmers,
  getFarmerByNationalId,
  getFilteredFarmer,
  updateFarmer,
  deleteFarmer,
  bulkInsertFarmers,
};

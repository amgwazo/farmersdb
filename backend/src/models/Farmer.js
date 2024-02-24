// models/Farmer.js
const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  company: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nationalId: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ["male", "female"] },
  year: { type: String, required: true },
  companyId: { type: String },
  creationDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  capturedBy: { type: String },
  lastModifiedBy: { type: String },
  loanAmount: { type: Number, default: 0 },
  loanBalance: { type: Number, default: 0 },
  batchNumber: {
    type: String,
    default: "1",
    // required: true,
    //  unique: true,
  },
});

// Add a compound index on nationalId and year with unique constraint
farmerSchema.index({ nationalId: 1, year: 1 }, { unique: true });
// Create the indexes
farmerSchema.indexes();

const Farmer = mongoose.model("Farmer", farmerSchema);

module.exports = Farmer;

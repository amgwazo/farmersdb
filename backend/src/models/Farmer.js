// models/Farmer.js
const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  company: { type: String, required: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nationalId: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ["male", "female"] },
  year: { type: String, required: true },
  companyId: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  capturedBy: { type: String },
  lastModifiedBy: { type: String },
});

// Add a compound index on nationalId and year with unique constraint
farmerSchema.index({ nationalId: 1, year: 1 }, { unique: true });
// Create the indexes
farmerSchema.indexes();

const Farmer = mongoose.model("Farmer", farmerSchema);

module.exports = Farmer;

const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  allowedCommodities: {
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Commodity",
          required: true,
        },
        name: String,
        price: Number,
      },
    ],
    required: true,
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;

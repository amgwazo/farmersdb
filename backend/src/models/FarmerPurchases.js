const mongoose = require("mongoose");

const commodityPurchasesSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  commodities: [
    {
      commodityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Commodity",
        required: true,
      },
      commodity: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  grossAmount: {
    type: Number,
    required: true,
  },
  recoveredAmount: {
    type: Number,
    required: true,
  },
  netAmount: {
    type: Number,
    required: true,
  },
  creationDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  capturedBy: { type: String },
  lastModifiedBy: { type: String },
});

const CommodityPurchases = mongoose.model(
  "CommodityPurchases",
  commodityPurchasesSchema
);

module.exports = CommodityPurchases;

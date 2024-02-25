const mongoose = require("mongoose");

const commoditySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Commodity = mongoose.model("Commodity", commoditySchema);

module.exports = Commodity;

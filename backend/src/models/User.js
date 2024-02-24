const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "farmer", "admin"], default: "user" },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  company: {
    type: String,
    enum: [
      "Kanele Holdings",
      "Farmers Board Of Zambia",
      "Chilonga Milling",
      "Matanda Agro",
      "Mkhuto Agriculture Services",
    ],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

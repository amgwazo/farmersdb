const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "farmer", "admin"], default: "user" },
  company: { type: String, enum: ["Farmers Board Of Zambia", "Chilonga Milling", "Matanda Agro", "Mkhuto Agriculture Services"]},
});

const User = mongoose.model("User", userSchema);

module.exports = User;

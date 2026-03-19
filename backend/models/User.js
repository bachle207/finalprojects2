const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account"
  },
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  phone: String,
  company: String,
  accountCreateDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", UserSchema);
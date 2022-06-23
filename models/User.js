const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true,
  },
  username: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createVerificationToken = async function () {
  return jwt.sign(
    { username: this.username, id: this.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

UserSchema.methods.checkPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  console.log(isMatch);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);

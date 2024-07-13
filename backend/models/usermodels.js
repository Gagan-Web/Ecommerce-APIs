const { strict } = require("assert");
const { kMaxLength } = require("buffer");
const mongoose = require("mongoose");
const { type } = require("os");
const { stringify } = require("querystring");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { uptime } = require("process");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Plese Enter Your Name"],
    MaxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name Should have more then 4 character"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validator: [validator.isEmail, "Please Enter Your valid Email"],
  },
  password: {
    type: String,
    required: [true, "Plese Enter Your Password"],
    minLength: [8, "Name Should have more then 8 character"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      // required:true
    },
    url: {
      type: String,
      // required:true
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//JWT TOKEN
userSchema.methods.getJWTTOKEN = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password

userSchema.methods.ComparePassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

//Generating Password Reset Token
// If the user forgot therw password they can easily fixed it
userSchema.methods.getResetPasswordToken = function () {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  //Hasing and adding ResetpasswordToken to userSchema
  (this.resetPasswordToken = crypto.createHash("sha256")).
    update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("user", userSchema);

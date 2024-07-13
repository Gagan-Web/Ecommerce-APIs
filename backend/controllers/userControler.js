const Errorhandler = require("../utils/errorhandler");
const catchAsyncerror = require("../middleware/catchAsyncError");
const User = require("../models/usermodels");
const sentToken = require("../utils/jwttoken");
const usermodels = require("../models/usermodels");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { error } = require("console");

//Register a user
exports.RegisterUser = catchAsyncerror(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is a sample id",
      user: "ProfileUrl",
    },
  });

  sentToken(user, 200, res);
});

// Login User
exports.loginUser = catchAsyncerror(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking If user has given password and email both
  if (!email || !password) {
    return next(new Errorhandler("Please Enter Email & Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new Errorhandler("Invalid email or password", 401));
  }
  const ispasswordMatch = user.ComparePassword(password);
  if (!ispasswordMatch) {
    return next(new Errorhandler("Invalid email or password", 401));
  }
  sentToken(user, 200, res);
});

//Logout User
exports.logout = catchAsyncerror(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//Forgot password
exports.forgotPassword = catchAsyncerror(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new Errorhandler("User not found", 404));
  }
  // Get resetpasswordtoken
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n If you have not requested this email then , please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email Sent ${user.email} Successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new Errorhandler(error.message, 500));
  }
});

//Reset password
exports.resetPassword = catchAsyncerror(async (req, res, next) => {
  //Creating token hash
  (this.resetPasswordToken = crypto.createHash("sha256"))
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new Errorhandler("Reset Password Token is invalid has been expired", 404)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new errorhandler(
        "Password does not match with the confirmed password",
        400
      )
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sentToken(user, 200, res);
});

//Get User Detail
exports.getUserDetails = catchAsyncerror(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//Update User Password
exports.updatePassword = catchAsyncerror(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.ComparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new Errorhandler("old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new Errorhandler("password does not match", 400));
  }
  user.password = req.body.newPassword;

  await user.save();

  sentToken(user, 200, res);
});

//Update User Profile
exports.updateProfile = catchAsyncerror(async (req, res, next) => {
  const newUserdata = {
    name: req.body.name,
    email: req.body.email,
  };

  //we will add cloudinary letter for avatar

  const user = await User.findByIdAndUpdate(req.user.id, newUserdata, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get All Users
exports.getAllUsers = catchAsyncerror(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Get single Users (admin)
exports.getSingleUser = catchAsyncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new Errorhandler(`User does not exist with id:${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Update User Role (user to admin) --Admin
exports.updateRole = catchAsyncerror(async (req, res, next) => {
  const newUserdata = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  //we will add cloudinary letter for avatar

  const user = await User.findByIdAndUpdate(req.params.id, newUserdata, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  if (!user) {
    return next(
      new Errorhandler(`User not found by this id : ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
  });
});

//Delete user --Admin
exports.deleteUser = catchAsyncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  //we will remove cloudinary letter for avatar
  if (!user) {
    return next(
      new Errorhandler(`User is not found with this id: ${req.params.id}`)
    );
  }

  await user.deleteOne()

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully"
  });
});

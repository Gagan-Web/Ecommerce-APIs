//Here how entered the right email and password only them are able to access the products or site

// And here we use cookie because the toker value is stored in a cookie in a login time

const catchAsyncError = require("./catchAsyncError");
const Errorhandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodels");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new Errorhandler("Please Login to access this resources", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeroles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Errorhandler(
          `Role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

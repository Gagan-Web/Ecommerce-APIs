// const { markAsUntransferable } = require("worker_threads");
const Errorhandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.message = err.message || "Internal Server Error";

  // To resolve the Cast Error of the wrong mongodb ID error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new Errorhandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new Errorhandler(message, 400);
  }
  //Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is Invalid , try again`;
    err = new Errorhandler(message, 400);
  }

  //JWT EXPIRE error
  if (err.name === "tokenExiredError") {
    const message = `Json web token is Expired, try again`;
    err = new Errorhandler(message, 400);
  }
 
  // stack is help to find the root of the error from were the error is coming
  res.status(err.statuscode).json({
    success: false,
    message: err.message,
  });
};

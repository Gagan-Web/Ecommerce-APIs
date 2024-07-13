const app = require("./app");

const dotenv = require("dotenv");
const connectdatabase = require("./config/database");

// Handling Uncaught Error
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("shutting down the server due to  Uncaught Error ");
  process.exit(1);
});

// config
dotenv.config({ path: "backend/config/.env" });

//connecting to database
connectdatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT} `);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down the server due to Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});

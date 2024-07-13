const express = require("express")
const cookieParser = require("cookie-parser")
const app = express()

const errorMiddleware = require("../backend/middleware/error")

app.use(express.json())
app.use(cookieParser())

//Route imports 
const product = require("./routes/productRoute")

const user = require("./routes/userRoute")

app.use("/api/v1", product)
app.use("/api/v1", user)

// middleware for error
app.use (errorMiddleware)

module.exports = app
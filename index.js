const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const cors = require("cors");
const userRouter = require("./src/Routers/userRoute");
const donateRouter = require("./src/Routers/donateRoute");
const bloodUnitrouter = require("./src/Routers/bloodRequstRoute");
const bloodRequestRouter = require("./src/Routers/bloodRequstRoute");
// const checkUserActive = require("./src/Controllers/UserController");



const app = express();
app.use(express.json());
app.use(cors());

app.use(express.json({ limit: process.env.REQUEST_LIMIT || "50mb" }));
app.use(express.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || "50mb" }));
app.use(mongoSanitize());
// app.use(checkUserActive); 

app.use(express.static(path.join(__dirname + "../../public")));

app.use("/uploads", express.static("public/"));
app.use("/api/user",userRouter);
app.use("/api/donate",donateRouter);
app.use("/api/bloodUnit",bloodUnitrouter);
app.use("/api/bloodRequest",bloodRequestRouter);

module.exports = app
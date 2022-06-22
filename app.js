require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// routing
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");

// middlewares
const authMiddleware = require("./middlewares/auth");
const errorHandler = require("./middlewares/error-handler");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", authMiddleware, blogRoutes);

app.use(errorHandler);

const port = process.env.PORT || 8000;
// app.listen(8000, () => {
//   console.log("App is listening");
// });

// const start = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     app.listen(port, () => {
//       console.log("Speak for the app is listening");
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };
// start();

module.exports = app;

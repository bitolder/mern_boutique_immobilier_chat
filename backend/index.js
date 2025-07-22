import express from "express";

import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import messageRouter from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDb } from "./lib/mongoDb.js";
import { app, server } from "./lib/socket.js";
dotenv.config();

// mongoose
//   .connect(process.env.MONGO)
//   .then(() => {
//     console.log("Connected to MongoDB!");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
const PORT = process.env.PORT;
app.use(express());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
server.listen(PORT, () => {
  console.log("server listening on PORT:" + PORT);
  connectDb();
});
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/messages", messageRouter);
// middle ware pour catch l'erreur
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
  });
});

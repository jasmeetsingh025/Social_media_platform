import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./src/features/User/routes/user.routes.js";
import postRouter from "./src/features/Posts/routes/posts.routes.js";
import commentsRouter from "./src/features/Comments/routes/comments.routes.js";
import likeRouter from "./src/features/Likes/routes/like.routes.js";
import friendRouter from "./src/features/Friends/routes/friends.routes.js";
import otpRouter from "./src/features/OTP_Validation/routes/otp.routes.js";

import connectToMongooseServer from "./src/config/mongoose.js";
import { appLvlErrorHandler } from "./src/ErrorHandler/errorHandler.js";
import jwtToken from "./src/middleware/Auth.middleware.js";

const app = new express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Adding the routes to handle all data requests
app.use("/api/users", userRouter);
app.use("/api/posts", jwtToken, postRouter);
app.use("/api/comments", jwtToken, commentsRouter);
app.use("/api/likes", jwtToken, likeRouter);
app.use("/api/friends", jwtToken, friendRouter);
app.use("/api/otp", otpRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Socal media server.");
});

app.use(appLvlErrorHandler);

app.use((req, res) => {
  res.status(404).send("API not found");
});

app.listen(3200, () => {
  console.log("Server of Socal media app is running on port 3200");
  connectToMongooseServer();
});

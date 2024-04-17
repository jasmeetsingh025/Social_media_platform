import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import userRouter from "./src/features/User/routes/user.routes.js";
import connectToMongooseServer from "./src/config/mongoose.js";
import { appLvlErrorHandler } from "./src/ErrorHandler/errorHandler.js";

const app = new express();
app.use(cors());
app.use(express.json());

// Adding the routes to handle all data requests
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Socal media server.");
});

app.use(appLvlErrorHandler);

app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.listen(3200, () => {
  console.log("Server of Socal media app is running on port 3200");
  connectToMongooseServer();
});

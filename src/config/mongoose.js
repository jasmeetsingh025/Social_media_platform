import mongoose from "mongoose";
import ApplicationError from "../ErrorHandler/errorHandler.js";

const connectToMongooseServer = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      dbName: process.env.DB_NAME,
    });
    console.log(
      `Connected to MongoDB ${process.env.DB_NAME} successfully using mongoose`
    );
  } catch (e) {
    console.log(e);
    throw new ApplicationError(e.message, 500);
  }
};

export default connectToMongooseServer;

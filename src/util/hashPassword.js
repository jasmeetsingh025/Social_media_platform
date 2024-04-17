import bcrypt from "bcrypt";
import ApplicationError from "../ErrorHandler/errorHandler";

export const hashPassword = async (password, next) => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (error) {
    next(new ApplicationError("encounterd error in hashing password", 400));
  }
};
export const compareHashedPassword = async (password, hashPassword, next) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    next(
      new ApplicationError("encounterd error in comparing hashed password", 400)
    );
  }
};

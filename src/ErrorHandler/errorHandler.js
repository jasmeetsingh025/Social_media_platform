export default class ApplicationError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const appLvlErrorHandler = (err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || "server Error! try later";
  res.status(err.status).json({
    success: false,
    error: err.message,
  });
};

const { CustomAPIError } = require("../errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(500).send(err.message);
};

module.exports = errorHandlerMiddleware;

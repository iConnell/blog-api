class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = {
  CustomAPIError,
  NotFoundError,
  UnauthorizedError,
};

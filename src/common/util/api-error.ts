class APIError extends Error {
  constructor(
    public statusCode: number, //This is important when dealing with constructor
    message: string,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
  static BadRequest(message: string = "Error while processing the request") {
    return new APIError(400, message);
  }
  static DBError(message: string = "DataBase error") {
    return new APIError(500, message);
  }
  static ValidationFailedError(message: string = "validatoin failed") {
    return new APIError(409, message);
  }
  static UnAuthorizedAccessError(
    message: string = "credentials entered were wrong",
  ) {
    return new APIError(401, message);
  }
  static TokenExpiredError(message: string = "Token has expired") {
    return new APIError(401, message);
  }
  static seatBookingError(message: string = "Can not book seats") {
    return new APIError(400, message);
  }
}

export default APIError;

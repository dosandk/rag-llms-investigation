class CustomError extends Error {
  name = "CustomError";

  constructor(message) {
    super(message);
  }
}

export class FetchError extends CustomError {
  name = "FetchError";

  constructor(data, response = {}, message = "") {
    super(`Bad request ${message}`.trim());

    this.response = response;
    this.data = data;
    this.statusCode = response.status;
  }
}

export class UnauthorizedError extends CustomError {
  name = "UnauthorizedError";
  statusCode = 401;

  constructor(data, response = {}, message = "") {
    super(`Unauthorized ${message}`.trim());

    this.response = response;
    this.data = data;
  }
}

export class BadRequestError extends CustomError {
  name = "BadRequestError";
  statusCode = 400;

  constructor(data, response = {}, message = "") {
    super(`Bad request ${message}`);

    this.response = response;
    this.data = data;
  }
}

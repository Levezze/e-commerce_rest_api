// Base class for application-specific errors
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message); // Pass message to the base Error class
    this.statusCode = statusCode; // Store the intended HTTP status code

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name; // Set error name to the class name
  }
};

// Specific error types extending the base AppError
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
};

export class ConflictError extends AppError {
  constructor(message = 'Conflict detected') {
    super(message, 409);
  }
};

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
};

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
};

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
};
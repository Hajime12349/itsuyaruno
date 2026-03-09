export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super("BadRequest", message);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super("NotFound", message);
    this.name = "NotFoundError";
  }
}

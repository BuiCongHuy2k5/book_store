export class InternalServerError extends Error {
  public readonly statusCode = 500;

  constructor(message: string = 'Internal Server Error') {
    super(message);
    this.name = 'InternalServerError';
  }
}

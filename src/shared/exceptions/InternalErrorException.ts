export class InternalErrorException extends Error {
  private statusCode: number;

  constructor(message: string, code = 500) {
    super(message);
    this.statusCode = code;
    Object.setPrototypeOf(this, InternalErrorException.prototype);
  }
}

export class BadRequestException extends Error {
  private statusCode: number;

  constructor(message: string, code = 400) {
    super(message);
    this.statusCode = code;
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}

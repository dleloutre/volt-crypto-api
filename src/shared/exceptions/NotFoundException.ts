export class NotFoundException extends Error {
  private statusCode: number;

  constructor(message: string, code = 404) {
    super(message);
    this.statusCode = code;
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

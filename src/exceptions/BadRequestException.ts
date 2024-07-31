export class BadRequestException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}
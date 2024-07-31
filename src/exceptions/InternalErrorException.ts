export class InternalErrorException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InternalErrorException.prototype);
  }
}
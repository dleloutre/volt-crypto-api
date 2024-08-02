export class ErrorResponse {
  statusCode: number;
  data: any;
  success: boolean;

  constructor(data: any, statusCode = 500) {
    this.statusCode = statusCode;
    this.data = data;
    this.success = false;
  }
}
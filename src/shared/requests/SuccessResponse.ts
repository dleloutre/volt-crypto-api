export class SuccessResponse {
  statusCode: number;
  data: any;
  success: boolean;

  constructor(data: any, statusCode = 200) {
    this.statusCode = statusCode;
    this.data = data;
    this.success = true;
  }
}

import { TransactionService } from '@application/services';
import { ErrorResponse } from '@shared/requests/ErrorResponse';
import { requestWrapper } from '@shared/requests/requestWrapper';
import { SuccessResponse } from '@shared/requests/SuccessResponse';
import { Request } from 'express';
import { Service } from 'typedi';

@Service()
export class TransactionController {
  constructor(public transactionService: TransactionService) {}

  buy = requestWrapper(async (req: Request) => {
    try {
      const response = await this.transactionService.buy(req.body);
      return new SuccessResponse(response);
    } catch (error) {
      return new ErrorResponse({ message: error.message }, error.statusCode);
    }
  });

  sell = requestWrapper(async (req: Request) => {
    try {
      const response = await this.transactionService.sell(req.body);
      return new SuccessResponse(response);
    } catch (error) {
      return new ErrorResponse({ message: error.message }, error.statusCode);
    }
  });
}

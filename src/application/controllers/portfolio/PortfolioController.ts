import { Service } from 'typedi';
import { Request } from 'express';
import { requestWrapper } from '@shared/requests/requestWrapper';
import { SuccessResponse } from '@shared/requests/SuccessResponse';
import { TransactionService } from '@application/services/TransactionService';
import { ErrorResponse } from '@shared/requests/ErrorResponse';

@Service()
export class PortfolioController {
  constructor(public transactionService: TransactionService) {}

  show = requestWrapper(async(req: Request) => {
    try {
      const response = await this.transactionService.getInvestments();
      return new SuccessResponse(response);
    } catch (error) {
      return new ErrorResponse({ message: error.message }, error.statusCode);
    }
  });
}
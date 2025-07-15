import {
  Body,
  Delete,
  Get,
  JsonController,
  Params,
  Patch,
  Post,
  QueryParam,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import winston from 'winston';
import { Logger } from '@Decorators/Logger';
import { plainToInstance } from 'class-transformer';
import { AccountService } from '@Services/AccountService';
import { CreateAccountRequest } from '@Rests/types/CreateAccountRequest';
import { CreateAccountResponse } from '@Rests/types/CreateAccountRespone';
import { CreateAccountInput } from '@Services/types/CreateAccountInput';
import { UpdateAccountRequest } from '@Rests/types/UpdateAccountRequest';
import { UpdateAccountInput } from '@Services/types/UpdateAccountInput';
import { UpdateAccountResponse } from '@Rests/types/UpdateAccountRespone';

@Service()
@JsonController('/Account')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class AccountController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private accountService: AccountService,
  ) {}

  @Post('/register')
  async create(@Body() body: CreateAccountRequest): Promise<CreateAccountResponse> {
    const input: CreateAccountInput = { ...body };
    const account = await this.accountService.createAccount(input);
    return plainToInstance(CreateAccountResponse, account, {
      excludeExtraneousValues: true,
    });
  }
  
 @Get('/search')
  async search(
    @QueryParam('username') username?: string,
  ) {
    const results = await this.accountService.search({ username});
    return results.map((map) =>
      plainToInstance(CreateAccountResponse, map, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const account = await this.accountService.getById(params.id);
    return plainToInstance(CreateAccountResponse, account, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdateAccountRequest,
  ) {
    const input: UpdateAccountInput = { accountId: params.id, ...req };
    const author = await this.accountService.partialUpdate(input);
    return plainToInstance(UpdateAccountResponse, author, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.accountService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
  return this.accountService.inactivateAccount(id);
}

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
  return this.accountService.restore(id);
  }
  
}

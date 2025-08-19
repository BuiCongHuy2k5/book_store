import { Authorized, Body, Delete, Get, JsonController, Param, Patch, Post, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import winston from 'winston';
import { Logger } from '@Decorators/Logger';
import { plainToInstance } from 'class-transformer';
import { AccountService } from '@Services/AccountService';
import { CreateAccountRequest } from '@Rests/types/CreateAccountRequest';
import { UpdateAccountRequest } from '@Rests/types/UpdateAccountRequest';

@Service()
@JsonController('/account')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class AccountController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private accountService: AccountService,
  ) {}

  @Post('/')
  async create(@Body() body: CreateAccountRequest) {
    const input = plainToInstance(CreateAccountRequest, body);
    return this.accountService.createAccount(input);
  }

  @Get('/search')
  async search(@QueryParam('userName') userName?: string) {
    const results = await this.accountService.search({ userName });
    return results;
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return this.accountService.getById(id);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() body: UpdateAccountRequest) {
    return this.accountService.partialUpdate({ id, ...body });
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return this.accountService.delete(id);
  }

  @Patch('/:id/inactivate')
  async inactivate(@Param('id') id: number) {
    return this.accountService.inactivateAccount(id);
  }

  @Patch('/:id/restore')
  async restore(@Param('id') id: number) {
    return this.accountService.restore(id);
  }

  @Post('/login')
  async login(@Body() body: { userName: string; passWord: string }) {
    return this.accountService.login(body);
  }

  @Post('/:id/change-password')
  async changePassword(@Param('id') id: number, @Body() body: { currentPassword: string; newPassword: string }) {
    return this.accountService.changePassword({
      id,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });
  }
}

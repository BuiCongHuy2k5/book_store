import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import winston from 'winston';
import { Logger } from '@Decorators/Logger';
import { CustomerService } from '@Services/CustomerService';
import { CreateCustomerRequest } from '@Rests/types/CreateCustomerRequest';
import { CreateCustomerInput } from '@Services/types/CreateCustomerInput';
import { UpdateCustomerRequest } from '@Rests/types/UpdateCustomerRequest';
import { UpdateCustomerInput } from '@Services/types/UpdateCustomerInput';

@Service()
@JsonController('/customer')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class CustomerController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private customerService: CustomerService,
  ) {}

  @Post('/')
  async create(@Body() body: CreateCustomerRequest) {
    const input: CreateCustomerInput = { ...body };
    const customer = await this.customerService.createCustomer(input);
    return customer;

  }

  @Get('/search')
  async search(
    @QueryParam('phone') phone?: string,
    @QueryParam('customerName') customerName?: string,
    @QueryParam('email') email?: string,
  ) {
    const results = await this.customerService.search({ phone, customerName, email });
    return results;
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const customer = await this.customerService.getById(params.id);
    return customer;
  }

  @Patch('/:id')
  async partialUpdate(@Params() params: { id: number },
                      @Body({ validate: true }) req: UpdateCustomerRequest) {
    const input: UpdateCustomerInput = { id: params.id, ...req };
    const customer = await this.customerService.partialUpdate(input);
    return customer;
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.customerService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
    return this.customerService.inactiveCustomer(id);
  }

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
    return this.customerService.restore(id);
  }
}

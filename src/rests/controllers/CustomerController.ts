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
import { CustomerService } from '@Services/CustomerService';
import { CreateCustomerRequest } from '@Rests/types/CreateCustomerRequest';
import { CreateCustomerResponse } from '@Rests/types/CreateCustomerRespone';
import { CreateCustomerInput } from '@Services/types/CreateCustomerInput';
import { UpdateCustomerRequest } from '@Rests/types/UpdateCustomerRequest';
import { UpdateCustomerInput } from '@Services/types/UpdateCustomerInput';
import { UpdateCustomerResponse } from '@Rests/types/UpdateCustomerRespone';

@Service()
@JsonController('/Customer')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class CustomerController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private customerService: CustomerService,
  ) {}

  @Post('/')
  async create(@Body() body: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const input: CreateCustomerInput = { ...body };
    const customer = await this.customerService.createCustomer(input);
    return plainToInstance(CreateCustomerResponse, customer, {
      excludeExtraneousValues: true,
    });
  }
  
 @Get('/search')
  async search(
    @QueryParam('phone') phone?: string,
    @QueryParam('customerName') customerName?: string,
    @QueryParam('email') email?: string,
  ) {
    const results = await this.customerService.search({ phone, customerName, email});
    return results.map((map) =>
      plainToInstance(CreateCustomerResponse, map, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const customer = await this.customerService.getById(params.id);
    return plainToInstance(CreateCustomerResponse, customer, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdateCustomerRequest,
  ) {
    const input: UpdateCustomerInput = { customerId: params.id, ...req };
    const customer = await this.customerService.partialUpdate(input);
    return plainToInstance(UpdateCustomerResponse, customer, {
      excludeExtraneousValues: true,
    });
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

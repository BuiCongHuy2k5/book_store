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
import { EmployeeService } from '@Services/EmployeeService';
import { CreateEmployeeRequest } from '@Rests/types/CreateEmployeeRequest';
import { CreateEmployeeResponse } from '@Rests/types/CreateEmployeeRespone';
import { CreateEmployeeInput } from '@Services/types/CreateEmployeeInput';
import { UpdateEmployeeRequest } from '@Rests/types/UpdateEmployeeRequest';
import { UpdateEmployeeInput } from '@Services/types/UpdateEmployeeInput';
import { UpdateEmployeeResponse } from '@Rests/types/UpdateEmployeeRespone';

@Service()
@JsonController('/Employee')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class EmployeeController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private employeeService: EmployeeService,
  ) {}

  @Post('/')
  async create(@Body() body: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
    const input: CreateEmployeeInput = { ...body };
    const employee = await this.employeeService.createEmployee(input);
    return plainToInstance(CreateEmployeeResponse, employee, {
      excludeExtraneousValues: true,
    });
  }
  
 @Get('/search')
  async search(
    @QueryParam('phone') phone?: string,
    @QueryParam('employeeName') employeeName?: string,
    ) {
    const results = await this.employeeService.search({ phone, employeeName});
    return results.map((map) =>
      plainToInstance(CreateEmployeeResponse, map, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const employee = await this.employeeService.getById(params.id);
    return plainToInstance(CreateEmployeeResponse, employee, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdateEmployeeRequest,
  ) {
    const input: UpdateEmployeeInput = { employeeId: params.id, ...req };
    const customer = await this.employeeService.partialUpdate(input);
    return plainToInstance(UpdateEmployeeResponse, customer, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.employeeService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
  return this.employeeService.inactiveEmployee(id);
}

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
  return this.employeeService.restore(id);
  }
  
}

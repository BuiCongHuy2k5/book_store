import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import winston from 'winston';
import { Logger } from '@Decorators/Logger';
import { EmployeeService } from '@Services/EmployeeService';
import { CreateEmployeeRequest } from '@Rests/types/CreateEmployeeRequest';
import { CreateEmployeeInput } from '@Services/types/CreateEmployeeInput';
import { UpdateEmployeeRequest } from '@Rests/types/UpdateEmployeeRequest';
import { UpdateEmployeeInput } from '@Services/types/UpdateEmployeeInput';

@Service()
@JsonController('/employee')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class EmployeeController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private employeeService: EmployeeService,
  ) {}

  @Post('/')
  async create(@Body() body: CreateEmployeeRequest) {
    const input: CreateEmployeeInput = { ...body };
    const employee = await this.employeeService.createEmployee(input);
    return employee;
  }

  @Get('/search')
  async search(@QueryParam('phone') phone?: string,
               @QueryParam('employeeName') employeeName?: string) {
    const results = await this.employeeService.search({ phone, employeeName });
    return results;
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const employee = await this.employeeService.getById(params.id);
    return employee;
  }

  @Patch('/:id')
  async partialUpdate(@Params() params: { id: number }, @Body({ validate: true }) req: UpdateEmployeeRequest) {
    const input: UpdateEmployeeInput = { id: params.id, ...req };
    const employee = await this.employeeService.partialUpdate(input);
    return employee;
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

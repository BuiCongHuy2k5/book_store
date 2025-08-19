import { Inject, Service } from 'typedi';
import { Logger } from '@Decorators/Logger';
import winston from 'winston';
import Redis from 'ioredis';
import { DeepPartial } from 'typeorm';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { RestRoles, UserRole } from '@Enums/RestRoles';
import { Account } from 'databases/postgres/entities/Account';
import { EmployeeRepository } from '@Repositories/EmployeeRepository';
import { CreateEmployeeInput } from './types/CreateEmployeeInput';
import { Employee } from 'databases/postgres/entities/Employee';
import { UpdateEmployeeInput } from './types/UpdateEmployeeInput';
import { AccountRepository } from '@Repositories/AccountRepository';
import { CustomerRepository } from '@Repositories/CustomerRepository';

@Service()
export class EmployeeService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis,
    private readonly employeeRepo: EmployeeRepository,
    private readonly accountRepo: AccountRepository,
    private readonly customerRepo: CustomerRepository,
  ) { }

  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    const isExist = await this.employeeRepo.isEmailOrPhoneExist(input.phone);
    const account = await this.accountRepo.getById(input.accountId);

    if (isExist) {
      throw new BadRequestError('PHONE NUMBER ALREDY EXIST');
    }
    if (!account) {
      throw new NotFoundError(`ACCOUNT NOT FOUND ID: ${input.accountId}`);
    }

    if (account.role !== UserRole.ADMIN) {
      throw new BadRequestError('ACCOUNT ROLE MUST BE USER FOR CUSTOMER');
    }

    // ❌ Không cho gán nếu account đã dùng rồi
    const existingCustomer = await this.customerRepo.getById(input.accountId);
    const existingEmployee = await this.employeeRepo.getById(input.accountId);

    if (existingCustomer || existingEmployee) {
      throw new BadRequestError('ACCOUNT HAS BEEN ALREADY ASSIGNED');
    }

    const employee = new Employee();
    employee.employeeCode = input.employeeCode;
    employee.employeeName = input.employeeName;
    employee.gender = input.gender;
    employee.phone = input.phone;
    employee.birthDate = input.birthDate;
    employee.address = input.address;
    employee.status = RestRoles.ACTIVE;
    employee.account = { id: input.accountId } as Account;

    return this.employeeRepo.create(employee);
  }

  async getById(id: number): Promise<Employee> {
    const employee = await this.employeeRepo.getById(id);
    if (!employee) {
      throw new NotFoundError(`EMPLOYEE NOT FOUND ID: ${id}`);
    }
    return employee;
  }

  async search(filters: { employeeName?: string; phone?: string }): Promise<Employee[]> {
    const results = await this.employeeRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO EMPLOYEE FOUND MATCHING FILTERS`);
    }
    return results;
  }

  async partialUpdate(input: UpdateEmployeeInput): Promise<Employee> {
    const employee = await this.employeeRepo.getById(input.id);
    const account = await this.accountRepo.getById(input.accountId);
    if (!employee) {
      throw new NotFoundError('EMPLOYEE NOT FOUND');
    }

    if (!account) {
      throw new NotFoundError(`ACCOUNT NOT FOUND ID: ${input.accountId}`);
    }

    if (account.role !== UserRole.ADMIN) {
      throw new BadRequestError('ACCOUNT ROLE MUST BE USER FOR CUSTOMER');
    }

    const isChangingPhone = input.phone && input.phone !== employee.phone;

    if (isChangingPhone) {
      const isExist = await this.employeeRepo.isEmailOrPhoneExistForOtherEmployee(input.id, input.phone);
      if (isExist) {
        throw new BadRequestError('PHONE NUMBER ALREDY EXIST');
      }
    }
    const { id, ...updateData } = input;
    return this.employeeRepo.partialUpdate(id, updateData as DeepPartial<Employee>);
  }

  async delete(employeeId: number): Promise<{ message: string }> {
    const employee = await this.employeeRepo.getById(employeeId);
    if (!employee) {
      throw new NotFoundError(`EMPLOYEE NOT FOUND ID: ${employeeId}`);
    }

    await this.employeeRepo.delete(employeeId);
    return { message: `DELETE EMPLOYEE ID: ${employeeId}` };
  }

  async inactiveEmployee(id: number): Promise<{ message: string }> {
    const employee = await this.employeeRepo.getById(id);
    if (!employee) {
      throw new NotFoundError(`EMPLOYEE NOT FOUND ID: ${id}`);
    }

    await this.employeeRepo.partialUpdate(id, { status: RestRoles.INACTIVE });

    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

  async restore(id: number): Promise<{ message: string }> {
    const employee = await this.employeeRepo.getById(id);
    if (!employee) {
      throw new NotFoundError(`EMPLOYEE NOT FOUND ID: ${id}`);
    }

    if (employee.status === RestRoles.ACTIVE) {
      return { message: `EMPLOYEE ID ${id} IS ALREADY ACTIVE` };
    }

    await this.employeeRepo.partialUpdate(id, { status: RestRoles.ACTIVE });

    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }
}

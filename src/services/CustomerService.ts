import { Inject, Service } from "typedi";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import Redis from "ioredis";
import { CustomerRepository } from "@Repositories/CustomerRepository";
import { Customer } from "databases/postgres/entities/Customer";
import { CreateCustomerInput } from "./types/CreateCustomerInput";
import { UpdateCustomerInput } from "./types/UpdateCustomerInput";
import { DeepPartial } from "typeorm";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { RestRoles } from "@Enums/RestRoles";
import { Account } from "databases/postgres/entities/Account";

@Service()
export class CustomerService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject("cache") private readonly cache: Redis.Redis,
    private readonly customerRepo: CustomerRepository
  ) {}

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const isExist = await this.customerRepo.isEmailOrPhoneExist(input.email, input.phone);
    if (isExist) {
      throw new BadRequestError("EMAIL OR PHONE NUMBER ALREDY EXIST");
    }

    const customer = new Customer();
    customer.customerCode = input.customerCode;
    customer.customerName = input.customerName;
    customer.gender = input.gender;
    customer.phone = input.phone;
    customer.email = input.email;
    customer.address = input.address;
    customer.status = RestRoles.ACTIVE;
    customer.account = { accountId: input.accountId } as Account;    

    return this.customerRepo.create(customer);
  }

  async getById(customerId: number): Promise<Customer> {
    const customer = await this.customerRepo.getById(customerId);
    if (!customer) {
      throw new NotFoundError(`CUSTOMER NOT FOUND ID: ${customerId}`);
    }
    return customer;
  }

  async search(filters: {customerName?: string; phone?: string; email?: string; }): Promise<Customer[]> {
  const results = await this.customerRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO CUSTOMER FOUND MATCHING FILTERS`);
    }
    return results;
  }

  async partialUpdate(input: UpdateCustomerInput): Promise<Customer> {
    const customer = await this.customerRepo.getById(input.customerId);
    if (!customer) {
      throw new NotFoundError("CUSTOMER NOT FOUND");
    }

    const isChangingEmailOrPhone =
        (input.email && input.email !== customer.email) ||
        (input.phone && input.phone !== customer.phone);
    
      if (isChangingEmailOrPhone) {
        const isExist = await this.customerRepo.isEmailOrPhoneExistForOtherCustomer(
          input.customerId,
          input.email,
          input.phone
        );
        if (isExist) {
          throw new BadRequestError('EMAIL OR PHONE NUMBER ALREDY EXIST');
        }

    const { customerId, ...updateData } = input;

    return this.customerRepo.partialUpdate(customerId, updateData as DeepPartial<Customer>);
        }
    }

  async delete(customerId: number): Promise<{ message: string }> {
    const customer = await this.customerRepo.getById(customerId);
    if (!customer) {
      throw new NotFoundError(`CUSTOMER NOT FOUND ID: ${customerId}`);
    }

    await this.customerRepo.delete(customerId);
    return { message: `DELETE CUSTOMER ID: ${customerId}` };
  }

 async inactiveCustomer(id: number): Promise<{ message: string }> {
    const customer = await this.customerRepo.getById(id);
    if (!customer) {
      throw new NotFoundError(`CUSTOMER NOT FOUND ID: ${id}`);
    }
  
    await this.customerRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
    }
  
    async restore(id: number): Promise<{message: string}> {
    const customer = await this.customerRepo.getById(id);
    if (!customer) {
      throw new NotFoundError(`CUSTOMER NOT FOUND ID: ${id}`);
    }
  
    if (customer.status === RestRoles.ACTIVE) {
      return { message: `CUSTOMER ID ${id} IS ALREADY ACTIVE` };
    }
  
    await this.customerRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }
}

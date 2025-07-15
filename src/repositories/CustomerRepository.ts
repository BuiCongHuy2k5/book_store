import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { Customer } from "databases/postgres/entities/Customer";


@Service()
export class CustomerRepository extends BaseOrmRepository<Customer> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Customer);
  }

  async create(customer: DeepPartial<Customer>): Promise<Customer> {
    return this.repo.save(customer);
  }

  async getById(customerId: number): Promise<Customer | null> {
    return this.repo.findOneBy({ customerId: customerId });
  }

  async search(filters: { customerName?: string; phone?: string; email?: string }): Promise<Customer[]> {
   const query = this.repo.createQueryBuilder('Customer');

    if (filters.customerName) {
      query.andWhere('LOWER(Customer.CustomerName) LIKE LOWER(:customerName)', {
        customerName: `%${filters.customerName}%`,
      });
    }
    if (filters.phone) {
      query.andWhere('LOWER(Customer.Phone) LIKE LOWER(:phone)', {
        phone: `%${filters.phone}%`,
      });
    }
    if (filters.email) {
      query.andWhere('LOWER(Customer.Email) LIKE LOWER(:email)', {
        email: `%${filters.email}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Customer>): Promise<Customer | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async isEmailOrPhoneExist(email: string, phone: string): Promise<boolean> {
    const existingCustomer = await this.repo
      .createQueryBuilder('Customer')
      .where('Customer.Email = :email OR Customer.Phone = :phone', { email, phone })
      .getOne();
    return !!existingCustomer;
  }
  
  async isEmailOrPhoneExistForOtherCustomer(customerId: number, email: string, phone: string): Promise<boolean> {
    const existingCustomer = await this.repo
      .createQueryBuilder('Customer')
      .where('(Customer.Email = :email OR Customer.Phone = :phone) AND Customer.CustomerId != :customerId', {
        email,
        phone,
        customerId,
      })
      .getOne();
    return !!existingCustomer;
  }
}

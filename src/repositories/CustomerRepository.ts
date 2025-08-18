import { Inject, Service } from 'typedi';
import { BaseOrmRepository } from './BaseOrmRepository';
import { Logger } from '@Decorators/Logger';
import winston from 'winston';
import { DataSource, DeepPartial } from 'typeorm';
import { Customer } from 'databases/postgres/entities/Customer';

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

  async getById(id: number): Promise<Customer | null> {
    return this.repo
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.account', 'account')
      .where('customer.id = :id', { id })
      .getOne();
  }

  async search(filters: { customerName?: string; phone?: string; email?: string }): Promise<Customer[]> {
    const query = this.repo.createQueryBuilder('customer').leftJoinAndSelect('customer.account', 'account');

    if (filters.customerName) {
      query.andWhere('LOWER(customer.customerName) LIKE LOWER(:customerName)', {
        customerName: `%${filters.customerName}%`,
      });
    }
    if (filters.phone) {
      query.andWhere('LOWER(customer.phone) LIKE LOWER(:phone)', {
        phone: `%${filters.phone}%`,
      });
    }
    if (filters.email) {
      query.andWhere('LOWER(customer.Email) LIKE LOWER(:email)', {
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
      .createQueryBuilder('customer')
      .where('customer.email = :email OR customer.phone = :phone', { email, phone })
      .getOne();
    return !!existingCustomer;
  }

  async isEmailOrPhoneExistForOtherCustomer(id: number, email: string, phone: string): Promise<boolean> {
    const existingCustomer = await this.repo
      .createQueryBuilder('customer')
      .where('(customer.email = :email OR customer.phone = :phone) AND customer.id != :id', {
        email,
        phone,
        id,
      })
      .getOne();
    return !!existingCustomer;
  }
}

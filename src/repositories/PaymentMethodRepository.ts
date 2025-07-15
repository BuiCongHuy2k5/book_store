import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { PaymentMethod } from "databases/postgres/entities/PaymentMethod";


@Service()
export class PaymentMethodRepository extends BaseOrmRepository<PaymentMethod> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, PaymentMethod);
  }

  async create(PaymentMethod: DeepPartial<PaymentMethod>): Promise<PaymentMethod> {
    return this.repo.save(PaymentMethod);
  }

  async getById(paymentMethodId: number): Promise<PaymentMethod | null> {
    return this.repo.findOneBy({ paymentMethodId: paymentMethodId });
  }

  async search(filters: { name?: string}): Promise<PaymentMethod[]> {
   const query = this.repo.createQueryBuilder('PaymentMethod');

    if (filters.name) {
      query.andWhere('LOWER(PaymentMethod.Name) LIKE LOWER(:name)', {
        name: `%${filters.name}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<PaymentMethod>): Promise<PaymentMethod | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  // async isEmailOrPhoneExist(email: string, phone: string): Promise<boolean> {
  //   const existingCustomer = await this.repo
  //     .createQueryBuilder('Customer')
  //     .where('Customer.Email = :email OR Customer.Phone = :phone', { email, phone })
  //     .getOne();
  //   return !!existingCustomer;
  // }
  
  // async isEmailOrPhoneExistForOtherCustomer(customerId: number, email: string, phone: string): Promise<boolean> {
  //   const existingCustomer = await this.repo
  //     .createQueryBuilder('Customer')
  //     .where('(Customer.Email = :email OR Customer.Phone = :phone) AND Customer.CustomerId != :customerId', {
  //       email,
  //       phone,
  //       customerId,
  //     })
  //     .getOne();
  //   return !!existingCustomer;
  // }
}

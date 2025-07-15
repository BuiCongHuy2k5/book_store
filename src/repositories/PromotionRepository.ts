import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { Promotion } from "databases/postgres/entities/Promotion";


@Service()
export class PromotionRepository extends BaseOrmRepository<Promotion> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Promotion);
  }

  async create(promotion: DeepPartial<Promotion>): Promise<Promotion> {
    return this.repo.save(promotion);
  }

  async getById(promotionId: number): Promise<Promotion | null> {
    return this.repo.findOneBy({ promotionId: promotionId });
  }

  async search(filters: { promotionName?: string}): Promise<Promotion[]> {
   const query = this.repo.createQueryBuilder('Promotion');

    if (filters.promotionName) {
      query.andWhere('LOWER(Promotion.PromotionName) LIKE LOWER(:promotionName)', {
        promotionName: `%${filters.promotionName}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Promotion>): Promise<Promotion | null> {
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

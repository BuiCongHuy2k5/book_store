import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { Cart } from "databases/postgres/entities/Cart";


@Service()
export class CartRepository extends BaseOrmRepository<Cart> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Cart);
  }

  async create(cart: DeepPartial<Cart>): Promise<Cart> {
    return this.repo.save(cart);
  }

  async getById(cartId: number): Promise<Cart | null> {
    return this.repo.findOneBy({ cartId: cartId });
  }

  async search(filters: { cartCode?: string}): Promise<Cart[]> {
   const query = this.repo.createQueryBuilder('Cart');

    if (filters.cartCode) {
      query.andWhere('LOWER(Cart.CartCode) LIKE LOWER(:cartCode)', {
        cartCode: `%${filters.cartCode}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Cart>): Promise<Cart | null> {
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

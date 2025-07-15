import { Logger } from "@Decorators/Logger";
import Redis  from "ioredis";
import { Inject, Service } from "typedi";
import winston from "winston";
import { RestRoles } from "@Enums/RestRoles";
import { NotFoundError } from "routing-controllers";
import { DeepPartial } from "typeorm";
import { CartRepository } from "@Repositories/CartRepository";
import { CreateCartInput } from "./types/CreateCartInput";
import { Cart } from "databases/postgres/entities/Cart";
import { Customer } from "databases/postgres/entities/Customer";
import { Account } from "databases/postgres/entities/Account";
import { UpdateCartInput } from "./types/UpdateCartInput";

@Service()
export class CartService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly cartRepo: CartRepository
  ) {}

  async createCart(input: CreateCartInput): Promise<Cart> {
    const cart = new Cart();
    cart.cartCode = input.cartCode;
    cart.customer = {customerId: input.customerId} as Customer;
    cart.account = {accountId: input.accountId} as Account;
    cart.status = RestRoles.ACTIVE;

    return this.cartRepo.create(cart);
  }

  async getById(cartId: number): Promise<Cart> {
    const cart = await this.cartRepo.getById(cartId);
    if (!cart) {
      throw new NotFoundError(`CART NOT FOUND ID: ${cartId}`);
    }
    return cart;
  }

  async search(filters: { cartCode?: string }): Promise<Cart[]> {
      const results = await this.cartRepo.search(filters);
      if (results.length === 0) {
        throw new NotFoundError(`NO CART FOUND MATCHING FILTERS`);
      }
      return results;
    }

  async partialUpdate(input: UpdateCartInput): Promise<Cart> {
    const cart = await this.cartRepo.getById(input.cartId);
    if (!cart) {
      throw new NotFoundError(`CART NOT FOUND`);
    }
  
    const { cartId, ...updateData } = input;
  
    return this.cartRepo.partialUpdate(cartId, updateData as DeepPartial<Cart>);
  }

  async delete(cartId: number): Promise<{ message: string }> {
    const cart = await this.cartRepo.getById(cartId);
    if (!cart) {
      throw new NotFoundError(`CART NOT FOUND ID: ${cartId}`);
    }

    await this.cartRepo.delete(cartId);
    return { message: `DELETE CART ID: ${cartId}` };
  }

  async inactiveCart(id: number): Promise<{ message: string }> {
    const cart = await this.cartRepo.getById(id);
    if (!cart) {
      throw new NotFoundError(`CART NOT FOUND ID: ${id}`);
    }
  
    await this.cartRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
    }
  
    async restore(id: number): Promise<{message: string}> {
    const cart = await this.cartRepo.getById(id);
    if (!cart) {
      throw new NotFoundError(`CART NOT FOUND ID: ${id}`);
    }
  
    if (cart.status === RestRoles.ACTIVE) {
      return { message: `CART ID ${id} IS ALREADY ACTIVE` };
    }
  
    await this.cartRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

}

import { Logger } from '@Decorators/Logger';
import Redis from 'ioredis';
import { Inject, Service } from 'typedi';
import winston from 'winston';
import { RestRoles, UserRole } from '@Enums/RestRoles';
import { NotFoundError } from 'routing-controllers';
import { DeepPartial } from 'typeorm';
import { CartRepository } from '@Repositories/CartRepository';
import { CreateCartInput } from './types/CreateCartInput';
import { Cart } from 'databases/postgres/entities/Cart';
import { UpdateCartInput } from './types/UpdateCartInput';
import { CustomerRepository } from '@Repositories/CustomerRepository';
import { BookRepository } from '@Repositories/BookRepository';
import { AccountRepository } from '@Repositories/AccountRepository';

@Service()
export class CartService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis,
    private readonly cartRepo: CartRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly bookRepo: BookRepository,
    private readonly accountRepo: AccountRepository,
  ) { }

  async createCart(input: CreateCartInput): Promise<Cart> {
    const account = await this.accountRepo.getById(input.accountId);
    if (!account) {
      throw new NotFoundError(`ACCOUNT NOT FOUND ID: ${input.accountId}`);
    }

    if (account.role !== UserRole.USER) {
      throw new NotFoundError('ONLY USER ACCOUNT CAN ADD TO CART');
    }

    const customer = await this.customerRepo.getById(input.customerId);
    if (!customer) {
      throw new NotFoundError(`CUSTOMER WITH NAME ${input.customerId} NOT FOUND`);
    }

    const book = await this.bookRepo.getById(input.bookId);
    if (!book) {
      throw new NotFoundError(`BOOK WITH NAME ${input.bookId} NOT FOUND`);
    }

    const totalAmount = input.price * input.quantity;

    const cart = new Cart();
    cart.cartCode = input.cartCode;
    cart.customer = customer;
    cart.account = account;
    cart.book = book;
    cart.quantity = input.quantity;
    cart.price = input.price;
    cart.totalAmount = totalAmount;
    cart.status = RestRoles.ACTIVE;

    return this.cartRepo.create(cart);
  }

  async getById(id: number): Promise<Cart> {
    const cart = await this.cartRepo.getById(id);
    if (!cart) {
      throw new NotFoundError(`CART NOT FOUND ID: ${id}`);
    }
    return cart;
  }

  async search(filters: { customerName?: string; bookName?: string }): Promise<Cart[]> {
    const results = await this.cartRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO CART FOUND MATCHING FILTERS`);
    }
    return results;
  }

  async partialUpdate(input: UpdateCartInput): Promise<Cart> {
    const { id, bookId, customerId, ...ortherdata } = input;
    const cart = await this.cartRepo.getById(input.id);
    if (!cart) {
      throw new NotFoundError(`CART NOT FOUND ID: ${input.id}`);
    }

    const updateData: Partial<Cart> = { ...ortherdata };

    if (bookId) {
      const book = await this.bookRepo.getById(bookId);
      if (!book) throw new NotFoundError('BOOK_NOT_FOUND');
      updateData.book = book;
    }

    if (customerId) {
      const customer = await this.customerRepo.getById(customerId);
      if (!customer) throw new NotFoundError('CUSTOMER_NOT_FOUND');
      updateData.customer = customer;
    }

    const quantity = input.quantity ?? cart.quantity;
    const price = input.price ?? cart.price;
    const totalAmount = price * quantity;

    updateData.totalAmount = totalAmount;
    return this.cartRepo.partialUpdate(id, updateData as DeepPartial<Cart>);
  }

  async delete(id: number): Promise<{ message: string }> {
    const cart = await this.cartRepo.getById(id);
    if (!cart) {
      throw new NotFoundError(`CART NOT FOUND ID: ${id}`);
    }

    await this.cartRepo.delete(id);
    return { message: `DELETE CART ID: ${id}` };
  }

  async inactiveCart(id: number): Promise<{ message: string }> {
    const cart = await this.cartRepo.getById(id);
    if (!cart) {
      throw new NotFoundError(`CART NOT FOUND ID: ${id}`);
    }

    await this.cartRepo.partialUpdate(id, { status: RestRoles.INACTIVE });

    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

  async restore(id: number): Promise<{ message: string }> {
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

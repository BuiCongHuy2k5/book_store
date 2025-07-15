import { Logger } from "@Decorators/Logger";
import Redis  from "ioredis";
import { Inject, Service } from "typedi";
import winston from "winston";
import { NotFoundError } from "routing-controllers";
import { DeepPartial } from "typeorm";
import { CartDetailRepository } from "@Repositories/CartDetailRepository";
import { CreateCartDetailInput } from "./types/CreateCartDetailInput";
import { CartDetail } from "databases/postgres/entities/CartDetail";
import { Cart } from "databases/postgres/entities/Cart";
import { BookDetail } from "databases/postgres/entities/BookDetail";
import { UpdateCartDetailInput } from "./types/UpdateCartDetailInput";

@Service()
export class CartDetailService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly cartDetailRepo: CartDetailRepository
  ) {}

  async createCartDetail(input: CreateCartDetailInput): Promise<CartDetail> {
    const cartDetail = new CartDetail();
    cartDetail.cart ={cartId: input.cartId} as Cart ;
    cartDetail.bookDetail = {bookDetailId: input.bookDetailId} as BookDetail;
    cartDetail.quantity = input.quantity;
    cartDetail.unitPrice = input.unitPrice;

    return this.cartDetailRepo.create(cartDetail);
  }

  async getById(cartDetailId: number): Promise<CartDetail> {
    const cartDetail = await this.cartDetailRepo.getById(cartDetailId);
    if (!cartDetail) {
      throw new NotFoundError(`CARTDETAIL NOT FOUND ID: ${cartDetailId}`);
    }
    return cartDetail;
  }

  async search(filters: { cartId?: string }): Promise<CartDetail[]> {
      const results = await this.cartDetailRepo.search(filters);
      if (results.length === 0) {
        throw new NotFoundError(`NO CARTDETAIL FOUND MATCHING FILTERS`);
      }
      return results;
    }

  async partialUpdate(input: UpdateCartDetailInput): Promise<CartDetail> {
    const cartDetail = await this.cartDetailRepo.getById(input.cartDetailId);
    if (!cartDetail) {
      throw new NotFoundError(`CARTDETAIL NOT FOUND`);
    }
  
    const { cartDetailId, ...updateData } = input;
  
    return this.cartDetailRepo.partialUpdate(cartDetailId, updateData as DeepPartial<CartDetail>);
  }

  async delete(cartDetailId: number): Promise<{ message: string }> {
    const cartDetail = await this.cartDetailRepo.getById(cartDetailId);
    if (!cartDetail) {
      throw new NotFoundError(`CARTDETAIL NOT FOUND ID: ${cartDetailId}`);
    }

    await this.cartDetailRepo.delete(cartDetailId);
    return { message: `DELETE PUBLISH ID: ${cartDetailId}` };
  }

  // async inactivePublisher(id: number): Promise<{ message: string }> {
  //   const publisher = await this.cartDetailRepo.getById(id);
  //   if (!publisher) {
  //     throw new NotFoundError(`PUBLISHER NOT FOUND ID: ${id}`);
  //   }
  
  //   await this.cartDetailRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
  
  //   return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  //   }
  
  //   async restore(id: number): Promise<{message: string}> {
  //   const publisher = await this.publisherRepo.getById(id);
  //   if (!publisher) {
  //     throw new NotFoundError(`PUBLISHER NOT FOUND ID: ${id}`);
  //   }
  
  //   if (publisher.status === RestRoles.ACTIVE) {
  //     return { message: `PUBLISH ID ${id} IS ALREADY ACTIVE` };
  //   }
  
  //   await this.publisherRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
  
  //   return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  // }

}

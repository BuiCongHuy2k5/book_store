import { Logger } from "@Decorators/Logger";
import Redis  from "ioredis";
import { Inject, Service } from "typedi";
import winston from "winston";
import { NotFoundError } from "routing-controllers";
import { DeepPartial } from "typeorm";
import { PaymentMethodRepository } from "@Repositories/PaymentMethodRepository";
import { CreatePaymentMethodInput } from "./types/CreatePaymentMethodInput";
import { PaymentMethod } from "databases/postgres/entities/PaymentMethod";
import { UpdatePaymentMethodInput } from "./types/UpdatePaymentMethodInput";

@Service()
export class PaymentMethodService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly paymentMethodRepo: PaymentMethodRepository
  ) {}
  

  async createPaymentMethod(input: CreatePaymentMethodInput): Promise<PaymentMethod> {
    const paymentMethod = new PaymentMethod();
    paymentMethod.name = input.name;

    return this.paymentMethodRepo.create(paymentMethod);
  }

  async getById(paymentMethodId: number): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepo.getById(paymentMethodId);
    if (!paymentMethod) {
      throw new NotFoundError(`PAYMENTMETHOD NOT FOUND ID: ${paymentMethodId}`);
    }
    return paymentMethod;
  }

  async search(filters: { name?: string }): Promise<PaymentMethod[]> {
      const results = await this.paymentMethodRepo.search(filters);
      if (results.length === 0) {
        throw new NotFoundError(`NO PAYMENTMETHOD FOUND MATCHING FILTERS`);
      }
      return results;
    }

  async partialUpdate(input: UpdatePaymentMethodInput): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepo.getById(input.paymentMethodId);
    if (!paymentMethod) {
      throw new NotFoundError(`PAYMENTMETHOD NOT FOUND`);
    }
  
    const { paymentMethodId, ...updateData } = input;
  
    return this.paymentMethodRepo.partialUpdate(paymentMethodId, updateData as DeepPartial<PaymentMethod>);
  }

  async delete(paymentMethodId: number): Promise<{ message: string }> {
    const paymentMethod = await this.paymentMethodRepo.getById(paymentMethodId);
    if (!paymentMethod) {
      throw new NotFoundError(`PAYMENTMETHOD NOT FOUND ID: ${paymentMethodId}`);
    }

    await this.paymentMethodRepo.delete(paymentMethodId);
    return { message: `DELETE PAYMENTMETHOD ID: ${paymentMethodId}` };
  }

  // async inactivePromotion(id: number): Promise<{ message: string }> {
  //   const promotion = await this.promotionRepo.getById(id);
  //   if (!promotion) {
  //     throw new NotFoundError(`PROMOTION NOT FOUND ID: ${id}`);
  //   }
  
  //   await this.promotionRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
  
  //   return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  //   }
  
  //   async restore(id: number): Promise<{message: string}> {
  //   const promotion = await this.promotionRepo.getById(id);
  //   if (!promotion) {
  //     throw new NotFoundError(`PROMOTION NOT FOUND ID: ${id}`);
  //   }
  
  //   if (promotion.status === RestRoles.ACTIVE) {
  //     return { message: `PROMOTION ID ${id} IS ALREADY ACTIVE` };
  //   }
  
  //   await this.promotionRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
  
  //   return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  // }

}

import { Logger } from "@Decorators/Logger";
import Redis  from "ioredis";
import { Inject, Service } from "typedi";
import winston from "winston";
import { RestRoles } from "@Enums/RestRoles";
import { NotFoundError } from "routing-controllers";
import { DeepPartial } from "typeorm";
import { PromotionRepository } from "@Repositories/PromotionRepository";
import { CreatePromotionInput } from "./types/CreatePromotionInput";
import { Promotion } from "databases/postgres/entities/Promotion";
import { UpdatePromotionInput } from "./types/UpdatePromotionInput";

@Service()
export class PromotionService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly promotionRepo: PromotionRepository
  ) {}
  

  async createPromotion(input: CreatePromotionInput): Promise<Promotion> {
    const promotion = new Promotion();
    promotion.promotionCode = input.promotionCode;
    promotion.promotionName = input.promotionName;
    promotion.startDate = input.startDate;
    promotion.endDate = input.endDate;
    promotion.quantity = input.quantity;
    promotion.status = RestRoles.ACTIVE;

    return this.promotionRepo.create(promotion);
  }

  async getById(promotionId: number): Promise<Promotion> {
    const promotion = await this.promotionRepo.getById(promotionId);
    if (!promotion) {
      throw new NotFoundError(`PROMOTION NOT FOUND ID: ${promotionId}`);
    }
    return promotion;
  }

  async search(filters: { promotionName?: string }): Promise<Promotion[]> {
      const results = await this.promotionRepo.search(filters);
      if (results.length === 0) {
        throw new NotFoundError(`NO PROMOTION FOUND MATCHING FILTERS`);
      }
      return results;
    }

  async partialUpdate(input: UpdatePromotionInput): Promise<Promotion> {
    const promotion = await this.promotionRepo.getById(input.promotionId);
    if (!promotion) {
      throw new NotFoundError(`PROMOTION NOT FOUND`);
    }
  
    const { promotionId, ...updateData } = input;
  
    return this.promotionRepo.partialUpdate(promotionId, updateData as DeepPartial<Promotion>);
  }

  async delete(promotionId: number): Promise<{ message: string }> {
    const promotion = await this.promotionRepo.getById(promotionId);
    if (!promotion) {
      throw new NotFoundError(`PROMOTION NOT FOUND ID: ${promotionId}`);
    }

    await this.promotionRepo.delete(promotionId);
    return { message: `DELETE PROMOTION ID: ${promotionId}` };
  }

  async inactivePromotion(id: number): Promise<{ message: string }> {
    const promotion = await this.promotionRepo.getById(id);
    if (!promotion) {
      throw new NotFoundError(`PROMOTION NOT FOUND ID: ${id}`);
    }
  
    await this.promotionRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
    }
  
    async restore(id: number): Promise<{message: string}> {
    const promotion = await this.promotionRepo.getById(id);
    if (!promotion) {
      throw new NotFoundError(`PROMOTION NOT FOUND ID: ${id}`);
    }
  
    if (promotion.status === RestRoles.ACTIVE) {
      return { message: `PROMOTION ID ${id} IS ALREADY ACTIVE` };
    }
  
    await this.promotionRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

}

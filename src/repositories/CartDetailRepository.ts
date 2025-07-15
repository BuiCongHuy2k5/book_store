import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { CartDetail } from "databases/postgres/entities/CartDetail";

@Service()
export class CartDetailRepository extends BaseOrmRepository<CartDetail> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, CartDetail);
  }

  async create(cartDetail: DeepPartial<CartDetail>): Promise<CartDetail> {
    return this.repo.save(cartDetail);
  }

  async getById(cartDetailId: number): Promise<CartDetail | null> {
    return this.repo.findOneBy({ cartDetailId: cartDetailId });
  }

  async search(filters: { cartId?: string }): Promise<CartDetail[]> {
  const query = this.repo.createQueryBuilder('CartDetail');

  if (filters.cartId) {
    const cartId = Number(filters.cartId);
    if (!isNaN(cartId)) {
      query.andWhere('CartDetail.CartId = :cartId', { cartId });
    }
  }

  return query.getMany();
}

  async partialUpdate(id: number, data: DeepPartial<CartDetail>): Promise<CartDetail | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  // async isPublisherCodeExist(publisherCode: string): Promise<boolean> {
  //   const found = await this.repo.findOneBy({ publisherCode: publisherCode });
  //   return !!found;
  // }

  // async isPublisherCodeExistForOther(id: number, publisherCode: string): Promise<boolean> {
  //   const found = await this.repo
  //     .createQueryBuilder('Publisher')
  //     .where('Publisher.PublisherCode = :publisherCode AND Publisher.PublisherId != :id', { publisherCode, id })
  //     .getOne();

  //   return !!found;
  // }
}
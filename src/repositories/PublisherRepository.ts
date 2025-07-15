import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { Publisher } from "databases/postgres/entities/Publisher";

@Service()
export class PublisherRepository extends BaseOrmRepository<Publisher> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Publisher);
  }

  async create(Publisher: DeepPartial<Publisher>): Promise<Publisher> {
    return this.repo.save(Publisher);
  }

  async getById(publisherId: number): Promise<Publisher | null> {
    return this.repo.findOneBy({ publisherId: publisherId });
  }

  async search(filters: { publisherName?: string;}): Promise<Publisher[]> {
    const query = this.repo.createQueryBuilder('Publisher');

    if (filters.publisherName) {
      query.andWhere('LOWER(Publisher.PublisherName) LIKE LOWER(:publisherName)', {
        publisherName: `%${filters.publisherName}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Publisher>): Promise<Publisher | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async isPublisherCodeExist(publisherCode: string): Promise<boolean> {
    const found = await this.repo.findOneBy({ publisherCode: publisherCode });
    return !!found;
  }

  async isPublisherCodeExistForOther(id: number, publisherCode: string): Promise<boolean> {
    const found = await this.repo
      .createQueryBuilder('Publisher')
      .where('Publisher.PublisherCode = :publisherCode AND Publisher.PublisherId != :id', { publisherCode, id })
      .getOne();

    return !!found;
  }
}
import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { BookDetail } from "databases/postgres/entities/BookDetail";


@Service()
export class BookDetailsRepository extends BaseOrmRepository<BookDetail> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, BookDetail);
  }

  async create(BookDetail: DeepPartial<BookDetail>): Promise<BookDetail> {
    return this.repo.save(BookDetail);
  }

  async getById(bookDetailId: number): Promise<BookDetail | null> {
    return this.repo.findOneBy({ bookDetailId: bookDetailId });
  }

  async search(filters: { bookDetailCode?: string;}): Promise<BookDetail[]> {
    const query = this.repo.createQueryBuilder('BookDetail');

    if (filters.bookDetailCode) {
      query.andWhere('LOWER(BookDetail.BookDetailCode) LIKE LOWER(:bookDetailCode)', {
        bookDetailCode: `%${filters.bookDetailCode}%`,
      });
    }
    
    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<BookDetail>): Promise<BookDetail | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async isBookDetailCodeNguExist(bookDetailCode : string): Promise<boolean> {
    const found = await this.repo.findOneBy({ bookDetailCode: bookDetailCode });
    return !!found;
  }

  async isBookDetailCodeExistForOther(id: number, bookDetailCode: string): Promise<boolean> {
    const found = await this.repo
      .createQueryBuilder('BookDetail')
      .where('BookDetail.BookDetailCode = :bookDetailCode AND BookDetail.BookDetailId != :id', { bookDetailCode, id })
      .getOne();

    return !!found;
  }
}
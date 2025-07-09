import { Inject, Service } from 'typedi';
import { DataSource, DeepPartial } from 'typeorm';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';
import { BaseOrmRepository } from '@Repositories/BaseOrmRepository';
import { Book } from 'databases/postgres/entities/Book';


@Service()
export class BookRepository extends BaseOrmRepository<Book> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Book);
  }

  async create(book: DeepPartial<Book>): Promise<Book> {
    return this.repo.save(book);
  }

  async getById(bookId: number): Promise<Book | null> {
    return this.repo.findOneBy({ bookId: bookId });
  }

  async search(filters: { bookCode?: string; bookId?: number }): Promise<Book[]> {
    const query = this.repo.createQueryBuilder('Book')
    .leftJoinAndSelect('Book.author', 'author') // JOIN tác giả

    if (filters.bookCode) {
      query.andWhere('LOWER(Book.BookCode) LIKE LOWER(:bookCode)', {
        bookCode: `%${filters.bookCode}%`,
      });
    }

    if (filters.bookId) {
      query.andWhere('Book.BookId = :bookId', { bookId: filters.bookId });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Book>): Promise<Book | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async isBookExist(bookCode: string): Promise<boolean> {
    const found = await this.repo.findOneBy({ bookCode: bookCode });
    return !!found;
  }

  async isBookExistForOther(bookId: number, bookCode: string): Promise<boolean> {
    const found = await this.repo
      .createQueryBuilder('Book')
      .where('Book.BookCode = :bookCode AND Book.BookId != :bookId', { bookCode, bookId })
      .getOne();

    return !!found;
  }
}
import { Inject, Service } from 'typedi';
import Redis from 'ioredis';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';
import { NotFoundError } from '@Errors/NotFoundError';
import { DeepPartial } from 'typeorm';
import { Language, RestRoles } from '@Enums/RestRoles';
import { BookDetailsRepository } from '@Repositories/BookDetailsRepository';
import { CreateBookDetailInput } from './types/CreateBookDetailInput';
import { BookDetail } from 'databases/postgres/entities/BookDetail';
import { UpdateBookDetailInput } from './types/UpdateBookDetailInput';
import { Book } from 'databases/postgres/entities/Book';
import { Author } from 'databases/postgres/entities/Author';
import { Publisher } from 'databases/postgres/entities/Publisher';

@Service()
export class BookDetailsService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly bookDetailRepo: BookDetailsRepository
  ) {}

  async createSachCT(input: CreateBookDetailInput): Promise<BookDetail> {
    const bookDetail = new BookDetail();

    bookDetail.bookDetailCode = input.bookDetailCode;
    bookDetail.book = { bookId: input.bookId } as Book;
    bookDetail.publisher = { publisherId: input.publisherId } as Publisher;
    bookDetail.author = { authorId: input.authorId } as Author;

    bookDetail.language = input.language;
    bookDetail.pages = input.pages;
    bookDetail.quantity = input.quantity;
    bookDetail.price = input.price;
    bookDetail.description = input.description;
    bookDetail.status = RestRoles.ACTIVE;

  return this.bookDetailRepo.create(bookDetail);
  }

  async getById(id: number): Promise<BookDetail> {
    const bookDetail = await this.bookDetailRepo.getById(id);
    if (!bookDetail) {
      throw new NotFoundError(`BOOKDETAILS NOT FOUND ID: ${id}`);
    }
    return bookDetail;
  }

  async search(filters: { bookDetailCode?: string }): Promise<BookDetail[]> {
    const results = await this.bookDetailRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO BOOKDETAILS FOUND MATCHING FILTERS`);
    }
    return results;
  }

  async partialUpdate(input: UpdateBookDetailInput): Promise<BookDetail> {
    const bookDetail = await this.bookDetailRepo.getById(input.bookDetailId);
    if (!bookDetail) {
      throw new NotFoundError(`BOOKDETAILS NOT FOUND ID: ${input.bookDetailId}`);
    }
    const { bookDetailId, ...updateData } = input;
    return this.bookDetailRepo.partialUpdate(bookDetailId, updateData as DeepPartial<BookDetail>);
  }

  async delete(id: number): Promise<{ message: string }> {
    const bookDetail = await this.bookDetailRepo.getById(id);
    if (!bookDetail) {
      throw new NotFoundError(`BOOKDETAILS NOT FOUND ID: ${id}`);
    }
    await this.bookDetailRepo.delete(id);
    return { message: `DELETE BOOKDETAILS ID: ${id}` };
  }

  async inactivateBookDetails(id: number): Promise<{ message: string }> {
    const bookDetail = await this.bookDetailRepo.getById(id);
    if (!bookDetail) {
      throw new NotFoundError(`BOOKDETAILS NOT FOUND ID: ${id}`);
    }
    await this.bookDetailRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
    return { message: `BOOKDETAILS ID ${id} IS NOW INACTIVE` };
  }

  async restore(id: number): Promise<{ message: string }> {
    const bookDetail = await this.bookDetailRepo.getById(id);
    if (!bookDetail) {
      throw new NotFoundError(`BOOKDETAILS NOT FOUND ID: ${id}`);
    }
    if (bookDetail.status === RestRoles.ACTIVE) {
      return { message: `BOOKDETAILS ID ${id} IS ALREADY ACTIVE` };
    }
    await this.bookDetailRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
    return { message: `BOOKDETAILS ID ${id} IS NOW ACTIVE` };
  }
}
import { Inject, Service } from 'typedi';
import Redis from 'ioredis';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';
import { NotFoundError } from '@Errors/NotFoundError';
import { DeepPartial } from 'typeorm';
import { RestRoles } from '@Enums/RestRoles';
import { BookRepository } from '@Repositories/BookRepository';
import { CreateBookInput } from './types/CreateBookInput';
import { Book } from 'databases/postgres/entities/Book';
import { Category } from 'databases/postgres/entities/Category';
import { UpdateBookInput } from './types/UpdateBookInput';

@Service()
export class BookService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly bookRepo: BookRepository
  ) {}

  async createSach(input: CreateBookInput): Promise<Book> {
    const book = new Book();
    book.bookCode = input.bookCode;
    book.bookName = input.bookName;
    book.status = RestRoles.ACTIVE;

    book.category = { categoryId: input.categoryId } as Category;

    return this.bookRepo.create(book);
  }

  async getById(bookId: number): Promise<Book> {
    const book = await this.bookRepo.getById(bookId);
  if (!book) {
    throw new NotFoundError(`BOOK NOT FOUND ID: ${bookId}`);
  }
  return book;
  }

  async search(filters: { bookCode?: string; bookId?: number }): Promise<Book[]> {
    const results = await this.bookRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO BOOKS FOUND MATCHING FILTERS`);
    }
    return results;
  }

  async partialUpdate(input: UpdateBookInput): Promise<Book> {
    const book = await this.bookRepo.getById(input.bookId);
    if (!book) {
      throw new NotFoundError(`BOOK NOT FOUND`);
    }
  
    const { bookId, ...updateData } = input;
  
    return this.bookRepo.partialUpdate(bookId, updateData as DeepPartial<Book>);
  }

  async delete(bookId: number): Promise<{ message: string }> {
    const book = await this.bookRepo.getById(bookId);
    if (!book) {
      throw new NotFoundError(`BOOK NOT FOUND ID: ${bookId}`);
    }

    await this.bookRepo.delete(bookId);
    return { message: `DELETE BOOK ID: ${bookId}` };
  }

  async inactivateBook(id: number): Promise<{ message: string }> {
    const book = await this.bookRepo.getById(id);
    if (!book) {
      throw new NotFoundError(`BOOK NOT FOUND ID: ${id}`);
    }
  
    await this.bookRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
    }
  
    async restore(id: number): Promise<{message: string}> {
    const book = await this.bookRepo.getById(id);
    if (!book) {
      throw new NotFoundError(`BOOK NOT FOUND ID: ${id}`);
    }
  
    if (book.status === RestRoles.ACTIVE) {
      return { message: `BOOK ID ${id} IS ALREADY ACTIVE` };
    }
  
    await this.bookRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

}

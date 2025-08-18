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
import { UpdateBookInput } from './types/UpdateBookInput';
import { CategoryRepository } from '@Repositories/CategoryRepository';
import { AuthorRepository } from '@Repositories/AuthorRepository';
import { PublisherRepository } from '@Repositories/PublisherRepository';

@Service()
export class BookService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis,
    private readonly bookRepo: BookRepository,
    private readonly cateRepo: CategoryRepository,
    private readonly authorRepo: AuthorRepository,
    private readonly publisherRepo: PublisherRepository,
  ) { }

  async createBook(input: CreateBookInput): Promise<Book> {
    const author = await this.authorRepo.getById(input.authorId);
    if (!author) {
      throw new NotFoundError(`Author with ID ${input.authorId} not found`);
    }

    const category = await this.cateRepo.getById(input.cateId);
    if (!category) {
      throw new NotFoundError(`Category with ID ${input.cateId} not found`);
    }

    const publisher = await this.publisherRepo.getById(input.publisherId);
    if (!publisher) {
      throw new NotFoundError(`Publisher with ID ${input.publisherId} not found`);
    }

    const book = new Book();
    book.bookCode = input.bookCode;
    book.bookName = input.bookName;
    book.status = RestRoles.ACTIVE;
    book.author = author;
    book.category = category;
    book.publisher = publisher;
    book.imageurl = input.imageurl;

    return this.bookRepo.create(book);
  }

  async getById(id: number): Promise<Book> {
    const book = await this.bookRepo.getById(id);
    if (!book) {
      throw new NotFoundError(`BOOK NOT FOUND ID: ${id}`);
    }
    return book;
  }

  async search(filters: { bookCode?: string; bookName?: string }): Promise<Book[]> {
    const results = await this.bookRepo.search(filters);

    if (results.length === 0) {
      throw new NotFoundError(`NO BOOKS FOUND MATCHING FILTERS`);
    }

    return results;
  }

  async partialUpdate(input: UpdateBookInput): Promise<Book> {
    const { id, cateId, authorId, publisherId, ...otherData } = input;
    const book = await this.bookRepo.getById(input.id);

    if (!book) {
      throw new NotFoundError(`BOOK NOT FOUND ID: ${input.id}`);
    }

    const updateData: Partial<Book> = { ...otherData };

    if (cateId) {
      const category = await this.cateRepo.getById(cateId);
      if (!category) throw new NotFoundError('CATEGORY_NOT_FOUND');
      updateData.category = category;
    }

    if (authorId) {
      const author = await this.authorRepo.getById(authorId);
      if (!author) throw new NotFoundError('AUTHOR_NOT_FOUND');
      updateData.author = author;
    }

    if (publisherId) {
      const publisher = await this.publisherRepo.getById(publisherId);
      if (!publisher) throw new NotFoundError('PUBLISHER_NOT_FOUND');
      updateData.publisher = publisher;
    }

    return this.bookRepo.partialUpdate(id, updateData as DeepPartial<Book>);
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

  async restore(id: number): Promise<{ message: string }> {
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

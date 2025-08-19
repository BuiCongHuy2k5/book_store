import { Logger } from '@Decorators/Logger';
import Redis from 'ioredis';
import { Inject, Service } from 'typedi';
import winston from 'winston';
import { NotFoundError } from 'routing-controllers';
import { DeepPartial } from 'typeorm';
import { RestRoles } from '@Enums/RestRoles';
import { AuthorRepository } from '@Repositories/AuthorRepository';
import { CreateAuthorInput } from './types/CreateAuthorInput';
import { Author } from 'databases/postgres/entities/Author';
import { UpdateAuthorInput } from './types/UpdateAuthorInput';

@Service()
export class AuthorService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis,
    private readonly authorRepo: AuthorRepository,
  ) { }

  async createAuthor(input: CreateAuthorInput): Promise<Author> {
    const author = new Author();
    author.authorCode = input.authorCode;
    author.authorName = input.authorName;
    author.birtDate = input.birtDate;
    author.status = RestRoles.ACTIVE;

    return this.authorRepo.create(author);
  }

  async getById(id: number): Promise<Author> {
    const author = await this.authorRepo.getById(id);
    if (!author) {
      throw new NotFoundError(`AUTHOR NOT FOUND ID: ${id}`);
    }
    return author;
  }

  async search(filters: { authorCode?: string; authorName?: string }): Promise<Author[]> {
    const result = await this.authorRepo.search(filters);
    if (result.length === 0) {
      throw new NotFoundError('NO AUTHORS FOUND MATCHING FILTERS');
    }
    return result;
  }

  async partialUpdate(input: UpdateAuthorInput): Promise<Author> {
    const author = await this.authorRepo.getById(input.id);
    if (!author) {
      throw new NotFoundError(`AUTHOR NOT FOUND`);
    }

    const { id, ...updateData } = input;
    console.log('Update payload:', updateData);

    return this.authorRepo.partialUpdate(id, updateData as DeepPartial<Author>);
  }

  async delete(id: number): Promise<{ message: string }> {
    const author = await this.authorRepo.getById(id);
    if (!author) {
      throw new NotFoundError(`AUTHOR NOT FOUND ID: ${id}`);
    }

    await this.authorRepo.delete(id);
    return { message: `DELETE AUTHOR ID: ${id}` };
  }

  async inactivateAuthor(id: number): Promise<{ message: string }> {
    const author = await this.authorRepo.getById(id);
    if (!author) {
      throw new NotFoundError(`AUTHOR NOT FOUND ID: ${id}`);
    }

    await this.authorRepo.partialUpdate(id, { status: RestRoles.INACTIVE });

    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

  async restore(id: number): Promise<{ message: string }> {
    const author = await this.authorRepo.getById(id);
    if (!author) {
      throw new NotFoundError(`AUTHOR NOT FOUND ID: ${id}`);
    }

    if (author.status === RestRoles.ACTIVE) {
      return { message: `AUTHOR ID ${id} IS ALREADY ACTIVE` };
    }

    await this.authorRepo.partialUpdate(id, { status: RestRoles.ACTIVE });

    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }
}

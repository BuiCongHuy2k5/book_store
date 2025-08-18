import { Inject, Service } from 'typedi';
import { BaseOrmRepository } from './BaseOrmRepository';
import { Logger } from '@Decorators/Logger';
import winston from 'winston';
import { DataSource, DeepPartial } from 'typeorm';
import { Author } from 'databases/postgres/entities/Author';

@Service()
export class AuthorRepository extends BaseOrmRepository<Author> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Author);
  }

  async create(auThor: DeepPartial<Author>): Promise<Author> {
    return this.repo.save(auThor);
  }

  async getById(id: number): Promise<Author | null> {
    return this.repo.findOneBy({ id });
  }

  async search(filters: { authorCode?: string; authorName?: string }): Promise<Author[]> {
    const query = this.repo.createQueryBuilder('Author');

    if (filters.authorCode) {
      query.andWhere('LOWER(Author.authorCode) LIKE LOWER(:authorCode)', {
        authorCode: `%${filters.authorCode}%`,
      });
    }

    if (filters.authorName) {
      query.andWhere('LOWER(Author.authorName) LIKE LOWER(:authorName)', {
        authorName: `%${filters.authorName}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Author>): Promise<Author | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  // async isAuthorCodeExist(authorCode: string): Promise<boolean> {
  //   const found = await this.repo.findOneBy({ authorCode: authorCode });
  //   return !!found;
  // }

  // async isAuthorCodeExistForOther(id: number, authorCode: string): Promise<boolean> {
  //   const found = await this.repo
  //     .createQueryBuilder('Author')
  //     .where('Author.AuthorCode = :authorCode AND Author.AuthorId != :id', { authorCode, id })
  //     .getOne();

  //   return !!found;
  // }
}

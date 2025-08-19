import { Inject, Service } from 'typedi';
import { BaseOrmRepository } from './BaseOrmRepository';
import { Logger } from '@Decorators/Logger';
import winston from 'winston';
import { DataSource, DeepPartial } from 'typeorm';
import { Account } from 'databases/postgres/entities/Account';

@Service()
export class AccountRepository extends BaseOrmRepository<Account> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Account);
  }

  async create(Account: DeepPartial<Account>): Promise<Account> {
    return this.repo.save(Account);
  }

  async getById(id: number): Promise<Account | null> {
    return this.repo.findOneBy({ id });
  }

  async search(filters: { userName?: string }): Promise<Account[]> {
    const query = this.repo.createQueryBuilder('account');

    if (filters.userName) {
      query.andWhere('LOWER(account.userName) LIKE LOWER(:userName)', {
        userName: `%${filters.userName}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Account>): Promise<Account | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async isUsernameExist(userName: string): Promise<boolean> {
    const account = await this.repo.findOneBy({ userName });
    return !!account;
  }


  async getByUserName(userName: string): Promise<Account | null> {
    return this.repo.findOneBy({ userName });
  }
}

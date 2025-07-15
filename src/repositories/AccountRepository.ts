import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { Account } from "databases/postgres/entities/Account";


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

  async getById(accountId: number): Promise<Account | null> {
    return this.repo.findOneBy({ accountId: accountId });
  }

  async search(filters: { username?: string}): Promise<Account[]> {
    const query = this.repo.createQueryBuilder('Account');

    if (filters.username) {
      query.andWhere('LOWER(Account.Username) LIKE LOWER(:username)', {
        username: `%${filters.username}%`,
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

  async isUsernameExist(username: string): Promise<boolean> {
  const account = await this.repo.findOneBy({ username });
  return !!account;
}

  // async isAccountExistForOther(id: number, authorCode: string): Promise<boolean> {
  //   const found = await this.repo
  //     .createQueryBuilder('Author')
  //     .where('Author.AuthorCode = :authorCode AND Author.AuthorId != :id', { authorCode, id })
  //     .getOne();

  //   return !!found;
  // }
}

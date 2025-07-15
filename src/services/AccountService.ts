import { Logger } from "@Decorators/Logger";
import Redis  from "ioredis";
import { Inject, Service } from "typedi";
import winston from "winston";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { DeepPartial } from "typeorm";
import { AccountRepository } from "@Repositories/AccountRepository";
import { CreateAccountInput } from "./types/CreateAccountInput";
import { Account } from "databases/postgres/entities/Account";
import { RestRoles, Role } from "@Enums/RestRoles";
import { UpdateAccountInput } from "./types/UpdateAccountInput";
import * as bcrypt from 'bcrypt';

@Service()
export class AccountService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly accountRepo: AccountRepository
  ) {}

  async createAccount(input: CreateAccountInput): Promise<Account> {
    const isExist = await this.accountRepo.isUsernameExist(input.username);
  if (isExist) {
    throw new BadRequestError(`Username "${input.username}" already exists.`);
  }
    const account = new Account();
    const hashedPassword = await bcrypt.hash(input.password, 10);
    account.username = input.username;
    account.password = hashedPassword;
    account.status = RestRoles.ACTIVE;
    account.role = input.role;// role truyền từ ADMIN

    return this.accountRepo.create(account);
  }

  async getById(id: number): Promise<Account> {
    const account = await this.accountRepo.getById(id);
    if (!account) {
      throw new NotFoundError(`ACCOUNT NOT FOUND ID: ${id}`);
    }
    return account;
  }

  async search(filters: {username?: string }): Promise<Account[]> {
    const result = await this.accountRepo.search(filters);
    if (result.length === 0) {
      throw new NotFoundError('NO ACCOUNT FOUND MATCHING FILTERS');
    }
    return result;
  }

  async partialUpdate(input: UpdateAccountInput): Promise<Account> {
  const account = await this.accountRepo.getById(input.accountId);
  if (!account) {
    throw new NotFoundError(`ACCOUNT NOT FOUND`);
  }

  const updateData: DeepPartial<Account> = {};

  // ✅ Nếu đổi username thì kiểm tra trùng
  if (input.username && input.username !== account.username) {
    const isExist = await this.accountRepo.isUsernameExist(input.username);
    if (isExist) {
      throw new BadRequestError(`Username "${input.username}" already exists.`);
    }
    updateData.username = input.username;
  }

  // ✅ Nếu có truyền password mới thì hash lại
  if (input.password) {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    updateData.password = hashedPassword;
  }

  return this.accountRepo.partialUpdate(input.accountId, updateData as DeepPartial<Account>);
}

  async delete(id: number): Promise<{ message: string }> {
    const account = await this.accountRepo.getById(id);
    if (!account) {
      throw new NotFoundError(`ACCOUNT NOT FOUND ID: ${id}`);
    }

    await this.accountRepo.delete(id);
    return { message: `DELETE ACCOUNT ID: ${id}` };
  }

  async inactivateAccount(id: number): Promise<{ message: string }> {
  const account = await this.accountRepo.getById(id);
  if (!account) {
    throw new NotFoundError(`ACCOUNT NOT FOUND ID: ${id}`);
  }

  await this.accountRepo.partialUpdate(id, { status: RestRoles.INACTIVE });

  return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

  async restore(id: number): Promise<{message: string}> {
  const account = await this.accountRepo.getById(id);
  if (!account) {
    throw new NotFoundError(`ACCOUNT NOT FOUND ID: ${id}`);
  }

  if (account.status === RestRoles.ACTIVE) {
    return { message: `ACCOUNT ID ${id} IS ALREADY ACTIVE` };
  }

  await this.accountRepo.partialUpdate(id, { status: RestRoles.ACTIVE });

  return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
}

}
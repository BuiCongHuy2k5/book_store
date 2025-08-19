import { Logger } from '@Decorators/Logger';
import Redis from 'ioredis';
import { Inject, Service } from 'typedi';
import winston from 'winston';
import { BadRequestError, NotFoundError, UnauthorizedError } from 'routing-controllers';
import { DeepPartial } from 'typeorm';
import { AccountRepository } from '@Repositories/AccountRepository';
import { CreateAccountInput } from './types/CreateAccountInput';
import { Account } from 'databases/postgres/entities/Account';
import { RestRoles, UserRole } from '@Enums/RestRoles';
import { UpdateAccountInput } from './types/UpdateAccountInput';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginInput } from './types/LoginInput';
import { ChangePasswordInput } from './types/ChangePasswordInput';
import { env } from '@Libs/env';
import fs from 'fs';
import path from 'path';

@Service()
export class AccountService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis,
    private readonly accountRepo: AccountRepository,
  ) { }

  async createAccount(input: CreateAccountInput): Promise<Account> {
    const isExist = await this.accountRepo.isUsernameExist(input.userName);
    if (isExist) {
      throw new BadRequestError(`Username "${input.userName}" already exists.`);
    }

    const hashedPassword = await bcrypt.hash(input.passWord, 10);
    const account = new Account();
    account.userName = input.userName;
    account.passWord = hashedPassword;
    account.status = RestRoles.ACTIVE;
    account.role = input.role;

    return this.accountRepo.create(account);
  }

  async login(input: LoginInput): Promise<{ token: string }> {
    const account = await this.accountRepo.getByUserName(input.userName);
    if (!account) {
      throw new UnauthorizedError('INVALID CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(input.passWord, account.passWord);
    if (!isMatch) {
      throw new UnauthorizedError('INVALID CREDENTIALS');
    }

    // Payload JWT
    const payload = {
      sub: account.id,       // chuẩn JWT claim
      roles: [account.role], // mảng roles để middleware dễ xử lý
    };

    const privateKey = fs.readFileSync(path.join(__dirname, "../../private.pem"), "utf8");
    // Tạo token
    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1h',
    });

    return { token };
  }

  async changePassword(input: ChangePasswordInput): Promise<{ message: string }> {
    const account = await this.accountRepo.getById(input.id);
    if (!account) throw new NotFoundError(`ACCOUNT NOT FOUND ID: ${input.id}`);

    const isMatch = await bcrypt.compare(input.currentPassword, account.passWord);
    if (!isMatch) throw new BadRequestError('CURRENT PASSWORD IS INCORRECT');

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);
    await this.accountRepo.partialUpdate(input.id, { passWord: hashedPassword });
    return { message: 'PASSWORD CHANGED SUCCESSFULLY' };
  }

  async getById(id: number): Promise<Account> {
    const account = await this.accountRepo.getById(id);
    if (!account) {
      throw new NotFoundError(`ACCOUNT NOT FOUND ID: ${id}`);
    }
    return account;
  }

  async search(filters: { userName?: string }): Promise<Account[]> {
    const result = await this.accountRepo.search(filters);
    if (result.length === 0) {
      throw new NotFoundError('NO ACCOUNT FOUND MATCHING FILTERS');
    }
    return result;
  }

  async partialUpdate(input: UpdateAccountInput): Promise<Account> {
    const account = await this.accountRepo.getById(input.id);
    if (!account) {
      throw new NotFoundError(`ACCOUNT NOT FOUND ${input.id}`);
    }

    const updateData: DeepPartial<Account> = {};

    if (input.userName && input.userName !== account.userName) {
      const isExist = await this.accountRepo.isUsernameExist(input.userName);
      if (isExist) {
        throw new BadRequestError(`Username "${input.userName}" already exists.`);
      }
      updateData.userName = input.userName;
    }

    if (input.passWord) {
      const hashedPassword = await bcrypt.hash(input.passWord, 10);
      updateData.passWord = hashedPassword;
    }

    if (input.status) updateData.status = input.status;
    if (input.role && Object.values(UserRole).includes(input.role as UserRole)) {
      updateData.role = input.role as UserRole;
    }

    return this.accountRepo.partialUpdate(input.id, updateData);
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
    return { message: `CHANGE STATUS SUCCESSFULLY ${id}` };
  }

  async restore(id: number): Promise<{ message: string }> {
    const account = await this.accountRepo.getById(id);
    if (!account) {
      throw new NotFoundError(`ACCOUNT NOT FOUND ID: ${id}`);
    }
    if (account.status === RestRoles.ACTIVE) {
      return { message: `ACCOUNT ID ${id} IS ALREADY ACTIVE` };
    }
    await this.accountRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
    return { message: `RESTORE STATUS SUCCESSFULLY ${id}` };
  }
}

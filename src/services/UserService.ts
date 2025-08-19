import Redis from 'ioredis';
import { Inject, Service } from 'typedi';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';

import { env } from '@Libs/env';

import { JSONParseError } from '@Errors/JSONParseError';

import { UserRepository } from '@Repositories/UserRepository';
import { CreateUserInput } from './types/CreateUserInput';
import { UpdateUserInput } from './types/UpdateUserInput';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '@Errors/BadRequestError';
import { NotFoundError } from '@Errors/NotFoundError';
import { User } from 'databases/postgres/entities/User';

@Service()
export class UserService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis,
    private readonly userRepo: UserRepository,
  ) { }

  async createUser(input: CreateUserInput) {
    // 🔒 Check trùng email hoặc sđt
    const isExist = await this.userRepo.isEmailOrPhoneExist(input.email, input.phoneNumber);
    if (isExist) {
      throw new BadRequestError('EMAIL OR PHONE NUMBER ALREDY EXIST');
    }

    const user = new User();
    user.name = input.name;
    user.email = input.email;
    user.phoneNumber = input.phoneNumber;
    user.passWord = await bcrypt.hash(input.passWord, 10); // Hash trước
    user.userName = input.userName;
    user.genDer = input.genDer;
    user.birtDate = input.birtDate;

    return this.userRepo.create(user);
  }

  async getById(id: number) {
    const user = await this.userRepo.getById(id); // log lỗi
    if (!user) {
      throw new NotFoundError(`USER NOT FOUND ID: ${id}`);
    } else {
      return user;
    }
  }

  async search(filters: { name?: string; email?: string; birtDate?: Date }) {
    const users = await this.userRepo.search(filters);
    if (users.length === 0) {
      throw new NotFoundError(`NO USERS WERE FOUND THAT MATCHED THE SEARCH CRITERIA. ${filters}`);
    }
    return users;
  }

  async partialUpdate(input: UpdateUserInput): Promise<User> {
    const user = await this.userRepo.getById(input.id);
    if (!user) throw new NotFoundError('USER NOT FOUND');

    const isChangingEmailOrPhone =
      (input.email && input.email !== user.email) || (input.phoneNumber && input.phoneNumber !== user.phoneNumber);

    if (isChangingEmailOrPhone) {
      const isExist = await this.userRepo.isEmailOrPhoneExistForOtherUser(input.id, input.email, input.phoneNumber);
      if (isExist) {
        throw new BadRequestError('EMAIL OR PHONE NUMBER ALREDY EXIST');
      }
    }

    if (input.passWord) {
      input.passWord = await bcrypt.hash(input.passWord, 10);
    }

    return this.userRepo.partialUpdate(input.id, input);
  }

  async delete(id: number) {
    const user = await this.userRepo.getById(id);
    if (!user) {
      throw new NotFoundError(`USER NOT FOUND ${id}`);
    }

    await this.userRepo.delete(id);
    return { message: `DELETE USER ID: ${id}` };
  }

  async register(input: CreateUserInput): Promise<User> {
    const isExist = await this.userRepo.isEmailOrPhoneExist(input.email, input.phoneNumber);
    if (isExist) {
      throw new Error('EMAIL OR PHONE NUMBER ALREDY EXIST');
    }

    const hashedPassword = await bcrypt.hash(input.passWord, 10);
    const user = await this.userRepo.create({
      ...input,
      passWord: hashedPassword,
    });

    return user;
  }

  async login(email: string, passWord: string): Promise<{ token: string; user: User }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      this.logger.warn(`LOGIN FAILED: EMAIL NOT FOUND: ${email}`);
      throw new BadRequestError('INCORRECT EMAIL OR PASSWORD');
    }

    const isMatch = await bcrypt.compare(passWord, user.passWord);
    console.log('passWord from input:', passWord);
    console.log('user.passWord from db:', user.passWord);

    if (!isMatch) {
      this.logger.warn(`LOGIN FAILED: WRONG PASSWORD: ${passWord}`);
      throw new BadRequestError('INCORRECT EMAIL OR PASSWORD');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '1h' });
    return { token, user };
  }
}

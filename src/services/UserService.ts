import  Redis  from 'ioredis';
import { Inject, Service } from 'typedi';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';

import { env } from '@Libs/env';

import { JSONParseError } from '@Errors/JSONParseError';

import { UserRepository } from '@Repositories/UserRepository';
import { CreateUserInput } from './types/CreateUserInput';
import { User } from '@Entities/User';
import { UpdateUserInput } from './types/UpdateUserInput';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@Service()
export class UserService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly userRepo: UserRepository,
  ) {}

   async createUser(input: CreateUserInput) {
    // 🔒 Check trùng email hoặc sđt
    const isExist = await this.userRepo.isEmailOrPhoneExist(input.email, input.phoneNumber);
    if (isExist) {
      throw new Error('Email hoặc số điện thoại đã tồn tại');
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
    return this.userRepo.getById(id);
  }

  async search(filters: {name?: string; email?: string; birtDate?: Date}) {
    return this.userRepo.search(filters);
}

  async update(input: UpdateUserInput): Promise<User> {
    // 🔒 Check trùng với người khác
    const isExist = await this.userRepo.isEmailOrPhoneExistForOtherUser(
      input.id,
      input.email,
      input.phoneNumber
    );
    if (isExist) {
      throw new Error('Email hoặc số điện thoại đã tồn tại ở tài khoản khác');
    }

    // Hash password nếu có cập nhật
    if (input.passWord) {
      input.passWord = await bcrypt.hash(input.passWord, 10);
    }

    return this.userRepo.update(input);
  }

  async delete(id: number) {
    return this.userRepo.delete(id);
  }

  async register(input: CreateUserInput): Promise<User> {
    const isExist = await this.userRepo.isEmailOrPhoneExist(input.email, input.phoneNumber);
    if (isExist) {
      throw new Error('Email hoặc số điện thoại đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(input.passWord, 10);
    const user = await this.userRepo.create({
      ...input,
      passWord: hashedPassword
    });

    return user;
  }

  async login(email: string, passWord: string): Promise<{ token: string; user: User }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      this.logger.warn(`Đăng nhập thất bại: không tìm thấy user với email ${email}`);
      throw new Error('Invalid credentials');
    }

  console.log('passWord from input:', passWord);
  console.log('user.passWord from db:', user.passWord);

    const isMatch = await bcrypt.compare(passWord, user.passWord);
    if (!isMatch) {
      this.logger.warn(`Đăng nhập thất bại: sai mật khẩu cho email ${email}`);
      throw new Error('INVALID CREDENTIALS');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user };
  }
}

import { Inject, Service } from 'typedi';
import { DataSource, DeepPartial, EntityRepository, Repository } from 'typeorm';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';

import { User } from '@Entities/User';

import { BaseOrmRepository } from '@Repositories/BaseOrmRepository';
import { UpdateUserInput } from '@Services/types/UpdateUserInput';

export function removeAccents(str: string): string {
  return str
    .normalize('NFD')                   // Tách chữ và dấu
    .replace(/[\u0300-\u036f]/g, '')    // Xoá dấu
    .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Thay đ -> d
    .toLowerCase();                     // Về chữ thường
}

@Service()
export class UserRepository extends BaseOrmRepository<User> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, User);
  }

  async create(user: DeepPartial<User>) {
    return this.repo.save(user);
  }

  async getById(id: number) {
    return this.repo.findOneBy({id});
  }

  async search(filters: {
  name?: string;
  email?: string;
  birtDate?: Date;
}): Promise<User[]> {
  const users = await this.repo.find(); // lấy toàn bộ users (có thể giới hạn nếu quá nhiều)

  const normalized = {
    name: filters.name ? removeAccents(filters.name).toLowerCase() : undefined,
    email: filters.email ? removeAccents(filters.email).toLowerCase() : undefined,
    birtDate: filters.birtDate
    };

  return users.filter(user => {
    const conditions = [
      !normalized.name || removeAccents(user.name ?? '').toLowerCase().includes(normalized.name),
      !normalized.email || removeAccents(user.email ?? '').toLowerCase().includes(normalized.email),
      !normalized.birtDate || new Date(user.birtDate).toDateString() === normalized.birtDate.toDateString()
    ];

    return conditions.every(Boolean);
  });
}

  async update(input: UpdateUserInput) {
    await this.repo.update(input.id, input);
    return this.getById(input.id); 
  }

  async delete(id: number){
    return this.repo.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
  return this.repo.findOneBy({ email });
}
 async isEmailOrPhoneExist(email: string, phoneNumber: string): Promise<boolean> {
    const existingUser = await this.repo
      .createQueryBuilder('user')
      .where('user.email = :email OR user.phoneNumber = :phoneNumber', { email, phoneNumber })
      .getOne();
    return !!existingUser;
  }

  async isEmailOrPhoneExistForOtherUser(id: number, email: string, phoneNumber: string): Promise<boolean> {
    const existingUser = await this.repo
      .createQueryBuilder('user')
      .where('(user.email = :email OR user.phoneNumber = :phoneNumber) AND user.id != :id', {
        email,
        phoneNumber,
        id,
      })
      .getOne();
    return !!existingUser;
  }
}

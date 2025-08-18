import { Inject, Service } from 'typedi';
import { DataSource, DeepPartial, EntityRepository, Repository } from 'typeorm';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';

import { BaseOrmRepository } from '@Repositories/BaseOrmRepository';
import { UpdateUserInput } from '@Services/types/UpdateUserInput';
import { User } from 'databases/postgres/entities/User';

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
    return this.repo.findOneBy({ id });
  }

  async search(filters: { name?: string; email?: string; birtDate?: Date }): Promise<User[]> {
    const query = this.repo.createQueryBuilder('user');
    const params: any = {};
    const conditions: string[] = [];

    // Lọc theo name
    if (filters.name) {
      conditions.push(`unaccent(lower(user.name)) LIKE unaccent(lower(:name))`);
      params.name = `%${filters.name}%`;
    }

    // Lọc theo email
    if (filters.email) {
      conditions.push(`unaccent(lower(user.email)) LIKE unaccent(lower(:email))`);
      params.email = `%${filters.email}%`;
    }

    // Lọc theo ngày sinh
    if (filters.birtDate) {
      conditions.push(`DATE(user.birtDate) = :birtDate`);
      params.birtDate = filters.birtDate.toISOString().slice(0, 10);
    }

    // Gộp các điều kiện
    if (conditions.length > 0) {
      query.where(conditions.join(' AND '), params);
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<User>): Promise<User> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number) {
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

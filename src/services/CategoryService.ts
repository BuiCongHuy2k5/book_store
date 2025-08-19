import { Inject, Service } from 'typedi';
import Redis from 'ioredis';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';
import { NotFoundError } from '@Errors/NotFoundError';
import { DeepPartial } from 'typeorm';
import { RestRoles } from '@Enums/RestRoles';
import { CategoryRepository } from '@Repositories/CategoryRepository';
import { Category } from 'databases/postgres/entities/Category';
import { CreateCategoryInput } from './types/CreateCategoryInput';
import { UpdateCategoryInput } from './types/UpdateCategoryInput';

@Service()
export class CategoryService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis,
    private readonly cateRepo: CategoryRepository,
  ) { }

  async CreateCate(input: CreateCategoryInput): Promise<Category> {
    const cateGory = new Category();
    cateGory.cateName = input.cateName;
    cateGory.cateCode = input.cateCode;
    cateGory.status = RestRoles.ACTIVE;

    return this.cateRepo.create(cateGory);
  }

  async getById(id: number): Promise<Category> {
    const cate = await this.cateRepo.getById(id);
    if (!cate) {
      throw new NotFoundError(`CATEGORY NOT FOUND ID: ${id}`);
    }
    return cate;
  }

  async search(filters: { cateName?: string }): Promise<Category[]> {
    const results = await this.cateRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO CATEGORIES FOUND MATCHING FILTERS`);
    }
    return results;
  }

  async partialUpdate(input: UpdateCategoryInput): Promise<Category | null> {
    const cate = await this.cateRepo.getById(input.id);
    if (!cate) {
      throw new NotFoundError(`CATEGORY NOT FOUND`);
    }

    const { id, ...updateData } = input;

    return this.cateRepo.partialUpdate(id, updateData as DeepPartial<Category>);
  }

  async delete(id: number): Promise<{ message: string }> {
    const cate = await this.cateRepo.getById(id);
    if (!cate) {
      throw new NotFoundError(`CATEGORY NOT FOUND ID: ${id}`);
    }

    await this.cateRepo.delete(id);
    return { message: `DELETE CATEGORY ID: ${id}` };
  }

  async inactivateCategory(id: number): Promise<{ message: string }> {
    const cate = await this.cateRepo.getById(id);
    if (!cate) {
      throw new NotFoundError(`CATEGORY NOT FOUND ID: ${id}`);
    }

    await this.cateRepo.partialUpdate(id, { status: RestRoles.INACTIVE });

    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

  async restore(id: number): Promise<{ message: string }> {
    const cate = await this.cateRepo.getById(id);
    if (!cate) {
      throw new NotFoundError(`CATEGORY NOT FOUND ID: ${id}`);
    }

    if (cate.status === RestRoles.ACTIVE) {
      return { message: `CATEGORY ID ${id} IS ALREADY ACTIVE` };
    }

    await this.cateRepo.partialUpdate(id, { status: RestRoles.ACTIVE });

    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }
}

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
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly cateRepo: CategoryRepository
  ) {}

  async CreateCate(input: CreateCategoryInput): Promise<Category> {
    const cateGory = new Category();
    cateGory.categoryName = input.categoryName;
    cateGory.status = RestRoles.ACTIVE;

    return this.cateRepo.create(cateGory);
  }

  async getById(categoryId: number): Promise<Category> {
    const cate = await this.cateRepo.getById(categoryId);
    if (!cate) {
      throw new NotFoundError(`DANH MUC NOT FOUND ID: ${categoryId}`);
    }
    return cate;
  }

  async search(filters: { categoryName?: string }): Promise<Category[]> {
    const results = await this.cateRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO CATEGORIES FOUND MATCHING FILTERS`);
    }
    return results;
  }

  async partialUpdate(input: UpdateCategoryInput): Promise<Category> {
      const cate = await this.cateRepo.getById(input.CategoryId);
      if (!cate) {
        throw new NotFoundError(`CATEGORY NOT FOUND`);
      }
    
      const { CategoryId, ...updateData } = input;
    
      return this.cateRepo.partialUpdate(CategoryId, updateData as DeepPartial<Category>);
    }

  async delete(categoryId: number): Promise<{ message: string }> {
    const cate = await this.cateRepo.getById(categoryId);
    if (!cate) {
      throw new NotFoundError(`CATEGORY NOT FOUND ID: ${categoryId}`);
    }

    await this.cateRepo.delete(categoryId);
    return { message: `DELETE CATEGORY ID: ${categoryId}` };
  }
  
  async inactivateCategory(id: number): Promise<{ message: string }> {
    const cate = await this.cateRepo.getById(id);
    if (!cate) {
      throw new NotFoundError(`CATEGORY NOT FOUND ID: ${id}`);
    }
  
    await this.cateRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
    }
  
    async restore(id: number): Promise<{message: string}> {
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

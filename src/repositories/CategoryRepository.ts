import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { Category } from "databases/postgres/entities/Category";


@Service()
export class CategoryRepository extends BaseOrmRepository<Category> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Category);
  }

  async create(category: DeepPartial<Category>): Promise<Category> {
    return this.repo.save(category);
  }

  async getById(id: number): Promise<Category | null> {
    return this.repo.findOneBy({ categoryId: id });
  }

  async search(filters: { categoryName?: string }): Promise<Category[]> {
    const query = this.repo.createQueryBuilder('Category');

    if (filters.categoryName) {
      query.where('LOWER(Category.CategoryName) LIKE LOWER(:categoryName)', {
        categoryName: `%${filters.categoryName}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Category>): Promise<Category | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async isCategoryCodeExist(categoryName: string): Promise<boolean> {
    const found = await this.repo.findOneBy({ categoryName: categoryName });
    return !!found;
  }

  async isCategoryNamexistForOther(id: number, categoryName: string): Promise<boolean> {
    const found = await this.repo
      .createQueryBuilder('Category')
      .where('Category.CategoryName = :categoryName AND Category.CategoryId != :id', { categoryName, id })
      .getOne();

    return !!found;
  }
}

import { Inject, Service } from 'typedi';
import { BaseOrmRepository } from './BaseOrmRepository';
import { Logger } from '@Decorators/Logger';
import winston from 'winston';
import { DataSource, DeepPartial } from 'typeorm';
import { Inventory } from 'databases/postgres/entities/Inventory';

@Service()
export class InventoryRepository extends BaseOrmRepository<Inventory> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Inventory);
  }

  async create(inventory: DeepPartial<Inventory>): Promise<Inventory> {
    return this.repo.save(inventory);
  }

  async getById(id: number): Promise<Inventory | null> {
    return this.repo
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.book', 'book')
      .where('inventory.id = :id', { id })
      .getOne();
  }

  async search(filters: { status?: string; quantity?: number }): Promise<Inventory[]> {
    const query = this.repo.createQueryBuilder('inventory').leftJoinAndSelect('inventory.book', 'book');

    if (filters.status) {
      query.andWhere('LOWER(inventory.Status) LIKE LOWER(:status)', {
        status: `%${filters.status}%`,
      });
    }

    if (filters.quantity) {
      query.andWhere('LOWER(inventory.quantity) LIKE LOWER(:quantity)', {
        quantity: `%${filters.quantity}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Inventory>): Promise<Inventory | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  // async isEmailOrPhoneExist( phone: string): Promise<boolean> {
  //   const existingEmployee = await this.repo
  //     .createQueryBuilder('Employee')
  //     .where('Employee.Phone = :phone', { phone })
  //     .getOne();
  //   return !!existingEmployee;
  // }

  // async isEmailOrPhoneExistForOtherEmployee(employeeId: number, phone: string): Promise<boolean> {
  //   const existingEmployee = await this.repo
  //     .createQueryBuilder('Employee')
  //     .where('(Employee.Phone = :phone) AND Employee.EmployeeId != :employeeId', {
  //       phone,
  //       employeeId,
  //     })
  //     .getOne();
  //   return !!existingEmployee;
  // }
}

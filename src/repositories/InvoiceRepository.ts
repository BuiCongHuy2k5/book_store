import { Inject, Service } from 'typedi';
import { BaseOrmRepository } from './BaseOrmRepository';
import { Logger } from '@Decorators/Logger';
import winston from 'winston';
import { DataSource, DeepPartial } from 'typeorm';
import { Invoice } from 'databases/postgres/entities/Invoice';

@Service()
export class InvoiceRepository extends BaseOrmRepository<Invoice> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Invoice);
  }

  async create(invoice: DeepPartial<Invoice>): Promise<Invoice> {
    return this.repo.save(invoice);
  }

  async getById(id: number): Promise<Invoice | null> {
    return this.repo
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.book', 'book')
      .leftJoinAndSelect('invoice.employee', 'employee')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .where('invoice.id = :id', { id })
      .getOne();
  }

  async search(filters: { bookName?: string; customerName?: string; createdAt?: Date }): Promise<Invoice[]> {
    const query = this.repo
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.book', 'book')
      .leftJoinAndSelect('invoice.employee', 'employee')
      .leftJoinAndSelect('invoice.customer', 'customer');

    if (filters.bookName) {
      query.andWhere('LOWER(book.bookName) LIKE LOWER(:bookName)', {
        bookName: `%${filters.bookName}%`,
      });
    }
    if (filters.customerName) {
      query.andWhere('LOWER(customer.customerName) LIKE LOWER(:customerName)', {
        customerName: `%${filters.customerName}%`,
      });
    }
    if (filters.createdAt) {
      query.andWhere('DATE(invoice.createdAt) = DATE(:createdAt)', {
        createdAt: filters.createdAt,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Invoice>): Promise<Invoice | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

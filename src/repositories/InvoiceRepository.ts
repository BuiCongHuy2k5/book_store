import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { Invoice } from "databases/postgres/entities/Invoice";


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

  async getById(invoiceId: number): Promise<Invoice | null> {
    return this.repo.findOneBy({ invoiceId: invoiceId });
  }

  async search(filters: { bookName?: string; invoiceCode?: string, createAt?: Date}): Promise<Invoice[]> {
   const query = this.repo.createQueryBuilder('Invoice');

    if (filters.bookName) {
      query.andWhere('LOWER(Invoice.BookName) LIKE LOWER(:bookName)', {
        bookName: `%${filters.bookName}%`,
      });
    }
    if (filters.invoiceCode) {
      query.andWhere('LOWER(Invoice.InvoiceCode) LIKE LOWER(:invoiceCode)', {
        invoiceCode: `%${filters.invoiceCode}%`,
      });
    }
    if (filters.createAt) {
      query.andWhere('LOWER(Invoice.CreateAt) LIKE LOWER(:createAt)', {
        createAt: `%${filters.createAt}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Invoice>): Promise<Invoice | null> {
    const invoice = await this.repo.findOneByOrFail({ invoiceId: id });
    this.repo.merge(invoice, data);
    return this.repo.save(invoice);
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

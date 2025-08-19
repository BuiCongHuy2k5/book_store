import { Inject, Service } from 'typedi';
import { Logger } from '@Decorators/Logger';
import winston from 'winston';
import Redis from 'ioredis';
import { DeepPartial } from 'typeorm';
import { NotFoundError } from 'routing-controllers';
import { StatusInvoice } from '@Enums/RestRoles';
import { InvoiceRepository } from '@Repositories/InvoiceRepository';
import { CreateInvoiceInput } from './types/CreateInvoiceInput';
import { Invoice } from 'databases/postgres/entities/Invoice';
import { UpdateInvoiceInput } from './types/UpdateInvoiceInput';
import { CustomerRepository } from '@Repositories/CustomerRepository';
import { EmployeeRepository } from '@Repositories/EmployeeRepository';
import { BookRepository } from '@Repositories/BookRepository';

@Service()
export class InvoiceService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis,
    private readonly invoiceRepo: InvoiceRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly employeeRepo: EmployeeRepository,
    private readonly bookRepo: BookRepository,
  ) { }

  async createInvocie(input: CreateInvoiceInput): Promise<Invoice> {
    const invoice = new Invoice();

    const customer = await this.customerRepo.getById(input.customerId);
    if (!customer) {
      throw new NotFoundError(`CUSTOMER WITH ID ${input.customerId} NOT FOUND`);
    }

    const book = await this.bookRepo.getById(input.bookId);
    if (!book) {
      throw new NotFoundError(`BOOK WITH ID ${input.bookId} NOT FOUND`);
    }

    const employee = await this.employeeRepo.getById(input.employeeId);
    if (!employee) {
      throw new NotFoundError(`EMPLOYEE WITH ID ${input.employeeId} NOT FOUND`);
    }

    const totalAmount = input.price * input.quantity;

    invoice.invoiceCode = input.invoiceCode;
    invoice.customer = customer;
    invoice.employee = employee;
    invoice.book = book;
    invoice.price = input.price;
    invoice.quantity = input.quantity;
    invoice.totalAmount = totalAmount;
    invoice.status = StatusInvoice.PAID;

    return this.invoiceRepo.create(invoice);
  }

  async getById(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepo.getById(id);
    if (!invoice) {
      throw new NotFoundError(`INVOICE NOT FOUND ID: ${id}`);
    }
    return invoice;
  }

  async search(filters: { customerName?: string; bookName?: string; createdAt?: Date }): Promise<Invoice[]> {
    const results = await this.invoiceRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO INVOICE FOUND MATCHING FILTERS`);
    }
    return results;
  }

  async partialUpdate(input: UpdateInvoiceInput): Promise<Invoice> {
    const { id, bookId, customerId, employeeId, ...ortherdata } = input;
    const invoice = await this.invoiceRepo.getById(input.id);
    if (!invoice) {
      throw new NotFoundError(`INVOICE NOT FOUND ID: ${input.id}`);
    }

    const updateData: Partial<Invoice> = { ...ortherdata };

    if (bookId) {
      const book = await this.bookRepo.getById(bookId);
      if (!book) throw new NotFoundError('BOOK_NOT_FOUND');
      updateData.book = book;
    }

    if (customerId) {
      const customer = await this.customerRepo.getById(customerId);
      if (!customer) throw new NotFoundError('CUSTOMER_NOT_FOUND');
      updateData.customer = customer;
    }

    if (employeeId) {
      const employee = await this.employeeRepo.getById(employeeId);
      if (!employee) throw new NotFoundError('EMPLOYEE_NOT_FOUND');
      updateData.employee = employee;
    }

    const totalAmount = input.price * input.quantity;

    invoice.totalAmount = totalAmount;

    return this.invoiceRepo.partialUpdate(id, updateData as DeepPartial<Invoice>);
  }

  async delete(invoiceId: number): Promise<{ message: string }> {
    const invoice = await this.invoiceRepo.getById(invoiceId);
    if (!invoice) {
      throw new NotFoundError(`INVOICE NOT FOUND ID: ${invoiceId}`);
    }

    await this.invoiceRepo.delete(invoiceId);
    return { message: `DELETE  INVOICE ID: ${invoiceId}` };
  }

  async cancelledInvoice(id: number): Promise<{ message: string }> {
    const invoice = await this.invoiceRepo.getById(id);
    if (!invoice) {
      throw new NotFoundError(`INVOICE NOT FOUND ID: ${id}`);
    }

    await this.invoiceRepo.partialUpdate(id, { status: StatusInvoice.CANCELLED });

    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

  async restore(id: number): Promise<{ message: string }> {
    const invoice = await this.invoiceRepo.getById(id);
    if (!invoice) {
      throw new NotFoundError(`INVOICE NOT FOUND ID: ${id}`);
    }

    if (invoice.status === StatusInvoice.PAID) {
      return { message: `INVOICE ID ${id} IS ALREADY ACTIVE` };
    }

    await this.invoiceRepo.partialUpdate(id, { status: StatusInvoice.PAID });

    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }
}

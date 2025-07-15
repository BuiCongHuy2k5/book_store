import { Inject, Service } from "typedi";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import Redis from "ioredis";
import { DeepPartial } from "typeorm";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { RestRoles } from "@Enums/RestRoles";
import { InvoiceRepository } from "@Repositories/InvoiceRepository";
import { CreateInvoiceInput } from "./types/CreateInvoiceInput";
import { Invoice } from "databases/postgres/entities/Invoice";
import { Customer } from "databases/postgres/entities/Customer";
import { Employee } from "databases/postgres/entities/Employee";
import { UpdateInvoiceInput } from "./types/UpdateInvoiceInput";

@Service()
export class InvoiceService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject("cache") private readonly cache: Redis.Redis,
    private readonly invoiceRepo: InvoiceRepository
  ) {}

  async createInvocie(input: CreateInvoiceInput): Promise<Invoice> {
    const invoice = new Invoice();
    invoice.invoiceCode = input.invoiceCode;
    invoice.customer = {customerId: input.customerId} as Customer;
    invoice.employee = {employeeId: input.employeeId} as Employee;
    invoice.totalAmount = input.totalAmount;
    invoice.bookName = input.bookName;
    invoice.status = RestRoles.ACTIVE;
    return this.invoiceRepo.create(invoice);
  }

  async getById(invoiceId: number): Promise<Invoice> {
    const invoice = await this.invoiceRepo.getById(invoiceId);
    if (!invoice) {
      throw new NotFoundError(`INVOICE NOT FOUND ID: ${invoiceId}`);
    }
    return invoice;
  }

  async search(filters: {invoiceCode?: string; bookName?: string; createAt?: Date;}): Promise<Invoice[]> {
  const results = await this.invoiceRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO INVOICE FOUND MATCHING FILTERS`);
    }
    return results;
  }

  async partialUpdate(input: UpdateInvoiceInput): Promise<Invoice> {
    const invoice = await this.invoiceRepo.getById(input.invoiceId);
    if (!invoice) {
      throw new NotFoundError("INVOICE NOT FOUND");
    }
    const { invoiceId, ...updateData } = input;

    // (updateData as any).updatedAt = new Date();

    return this.invoiceRepo.partialUpdate(invoiceId, updateData as DeepPartial<Employee>);
    
  }

  async delete(invoiceId: number): Promise<{ message: string }> {
    const invoice = await this.invoiceRepo.getById(invoiceId);
    if (!invoice) {
      throw new NotFoundError(`INVOICE NOT FOUND ID: ${invoiceId}`);
    }

    await this.invoiceRepo.delete(invoiceId);
    return { message: `DELETE INVOICE ID: ${invoiceId}` };
  }

 async inactiveInvoice(id: number): Promise<{ message: string }> {
    const invoice = await this.invoiceRepo.getById(id);
    if (!invoice) {
      throw new NotFoundError(`INVOICE NOT FOUND ID: ${id}`);
    }
  
    await this.invoiceRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
    }
  
    async restore(id: number): Promise<{message: string}> {
    const invoice = await this.invoiceRepo.getById(id);
    if (!invoice) {
      throw new NotFoundError(`INVOICE NOT FOUND ID: ${id}`);
    }
  
    if (invoice.status === RestRoles.ACTIVE) {
      return { message: `INVOICE ID ${id} IS ALREADY ACTIVE` };
    }
  
    await this.invoiceRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }
}

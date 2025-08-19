import { Logger } from '@Decorators/Logger';
import { CreateInvoiceRequest } from '@Rests/types/CreateInvoiceRequest';
import { UpdateInvoiceRequest } from '@Rests/types/UpdateInvoiceRequest';
import { InvoiceService } from '@Services/InvoiceService';
import { CreateInvoiceInput } from '@Services/types/CreateInvoiceInput';
import { UpdateInvoiceInput } from '@Services/types/UpdateInvoiceInput';
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import winston from 'winston';

@Service()
@JsonController('/invoice')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class InvoiceController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Post('/')
  async create(@Body() body: CreateInvoiceRequest) {
    const input: CreateInvoiceInput = { ...body };
    const result = await this.invoiceService.createInvocie(input);
    return result;
  }

  @Get('/search')
  async search(
    @QueryParam('customerName') customerName?: string,
    @QueryParam('bookName') bookName?: string,
    @QueryParam('createdAt') createdAt?: Date,
  ) {
    const result = await this.invoiceService.search({ customerName, bookName, createdAt });
    return result;
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const result = await this.invoiceService.getById(params.id);
    return result;
  }

  @Patch('/:id')
  async partialUpdate(@Params() params: { id: number }, @Body({ validate: true }) req: UpdateInvoiceRequest) {
    const input: UpdateInvoiceInput = { id: params.id, ...req };
    const invoice = await this.invoiceService.partialUpdate(input);
    return invoice;
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.invoiceService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
    return this.invoiceService.cancelledInvoice(id);
  }

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
    return this.invoiceService.restore(id);
  }
}

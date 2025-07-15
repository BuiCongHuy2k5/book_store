import { Logger } from "@Decorators/Logger";
import { CreateInvoiceRequest } from "@Rests/types/CreateInvoiceRequest";
import { CreateInvoiceResponse } from "@Rests/types/CreateInvoiceRespone";
import { UpdateInvoiceRequest } from "@Rests/types/UpdateInvoiceRequest";
import { UpdateInvoiceResponse } from "@Rests/types/UpdateInvoiceRespone";
import { InvoiceService } from "@Services/InvoiceService";
import { CreateInvoiceInput } from "@Services/types/CreateInvoiceInput";
import { UpdateInvoiceInput } from "@Services/types/UpdateInvoiceInput";
import { plainToInstance } from "class-transformer";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import winston from "winston";

@Service()
@JsonController('/Invoice')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class InvoiceController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly invoiceService: InvoiceService
  ) {}

  @Post('/')
  async create(@Body() body: CreateInvoiceRequest): Promise<CreateInvoiceResponse> {
    const input: CreateInvoiceInput = { ...body };
    const result = await this.invoiceService.createInvocie(input);
    return plainToInstance(CreateInvoiceResponse, result, {
      excludeExtraneousValues: true
    });
  }

  @Get('/search')
  async search(
    @QueryParam('invoiceCode') invoiceCode?: string,
    @QueryParam('bookName') bookName?: string,
    @QueryParam('createAt') createAt?: Date,
  ) {
    const result = await this.invoiceService.search({invoiceCode,bookName, createAt });
    return result.map(map =>
      plainToInstance(CreateInvoiceResponse, map, { excludeExtraneousValues: true })
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const result = await this.invoiceService.getById(params.id);
    return plainToInstance(CreateInvoiceResponse, result, {
      excludeExtraneousValues: true
    });
  }


  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdateInvoiceRequest
  ) {
    const input: UpdateInvoiceInput = { invoiceId: params.id, ...req };
    const invoice = await this.invoiceService.partialUpdate(input);
    return plainToInstance(UpdateInvoiceResponse, invoice, {
      excludeExtraneousValues: true
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.invoiceService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
  return this.invoiceService.inactiveInvoice(id);
}

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
  return this.invoiceService.restore(id);
  }
}
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import winston from 'winston';
import { Logger } from '@Decorators/Logger';
import { plainToInstance } from "class-transformer";
import { BookService } from "@Services/BookService";
import { CreateBookRequest } from "@Rests/types/CreateBookRequest";
import { CreateBookResponse } from "@Rests/types/CreateBookRespone";
import { CreateBookInput } from "@Services/types/CreateBookInput";
import { UpdateBookRequest } from "@Rests/types/UpdateBookRequest";
import { UpdateBookInput } from "@Services/types/UpdateBookInput";


@Service()
@JsonController('/Book')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class BookController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private bookService: BookService
  ) {}

  @Post('/')
  async create(@Body() body: CreateBookRequest): Promise<CreateBookResponse> {
    const input: CreateBookInput = { ...body };
    const book = await this.bookService.createSach(input);
    return plainToInstance(CreateBookResponse, book, {
      excludeExtraneousValues: true
    });
  }

    @Get('/search')
  async search(
    @QueryParam('bookCode') bookCode?: string,
    @QueryParam('bookId') bookId?: number
  ) {
    const result = await this.bookService.search({ bookCode, bookId });
    return result.map(map =>
      plainToInstance(CreateBookResponse, map, { excludeExtraneousValues: true })
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const book = await this.bookService.getById(params.id);
    return plainToInstance(CreateBookResponse, book, {
      excludeExtraneousValues: true
    });
  }

  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdateBookRequest
  ) {
    const input: UpdateBookInput = { bookId: params.id, ...req };
    const book = await this.bookService.partialUpdate(input);
    return plainToInstance(CreateBookResponse, book, {
      excludeExtraneousValues: true
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.bookService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
  return this.bookService.inactivateBook(id);
}

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
  return this.bookService.restore(id);
  
  }
}
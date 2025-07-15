import { Logger } from "@Decorators/Logger";
import { CreateBookDetailRequest } from "@Rests/types/CreateBookDetailRequest";
import { CreateBookDetailResponse } from "@Rests/types/CreateBookDetailRespone";
import { UpdateBookDetailRequest } from "@Rests/types/UpdateBookDetailRequest";
import { UpdateBookDetailResponse } from "@Rests/types/UpdateBookDetailRespone";
import { BookDetailsService } from "@Services/BookDetailsService";
import { CreateBookDetailInput } from "@Services/types/CreateBookDetailInput";
import { UpdateBookDetailInput } from "@Services/types/UpdateBookDetailInput";
import { plainToInstance } from "class-transformer";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import winston from "winston";

@Service()
@JsonController('/BookDetail')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class BookDetailsController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly bookDetailService: BookDetailsService
  ) {}

  @Post('/')
  async create(@Body() body: CreateBookDetailRequest): Promise<CreateBookDetailResponse> {
    const input: CreateBookDetailInput = { ...body };
    const result = await this.bookDetailService.createSachCT(input);
    return plainToInstance(CreateBookDetailResponse, result, {
      excludeExtraneousValues: true
    });
  }

  @Get('/search')
  async search(@QueryParam('bookDetailCode') bookDetailCode?: string) {
    const result = await this.bookDetailService.search({ bookDetailCode });
    console.log('Raw entity:', JSON.stringify(result[0], null, 2));
    return result.map(map =>
      plainToInstance(CreateBookDetailResponse, map, { excludeExtraneousValues: true })
    );
    
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const result = await this.bookDetailService.getById(params.id);
    return plainToInstance(CreateBookDetailResponse, result, {
      excludeExtraneousValues: true
    });
  }


  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdateBookDetailRequest
  ) {
    const input: UpdateBookDetailInput = { bookDetailId: params.id, ...req };
    const bookDetail = await this.bookDetailService.partialUpdate(input);
    return plainToInstance(UpdateBookDetailResponse, bookDetail, {
      excludeExtraneousValues: true
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.bookDetailService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
  return this.bookDetailService.inactivateBookDetails(id);
}

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
  return this.bookDetailService.restore(id);
  }
}
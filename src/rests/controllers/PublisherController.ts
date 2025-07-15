import { Logger } from "@Decorators/Logger";
import { CreatePublisherRequest } from "@Rests/types/CreatePublisherRequest";
import { CreatePublisherResponse } from "@Rests/types/CreatePublisherRespone";
import { UpdatePublisherRequest } from "@Rests/types/UpdatePublisherRequest";
import { UpdatePublisherResponse } from "@Rests/types/UpdatePublisherRespone";
import { PublisherService } from "@Services/PublisherService";
import { CreatePublisherInput } from "@Services/types/CreatePublisherInput";
import { UpdatePublisherInput } from "@Services/types/UpdatePublisherInput";
import { plainToInstance } from "class-transformer";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import winston from "winston";

@Service()
@JsonController('/Publisher')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class PublisherController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly publisherSerivce: PublisherService
  ) {}

  @Post('/')
  async create(@Body() body: CreatePublisherRequest): Promise<CreatePublisherResponse> {
    const input: CreatePublisherInput = { ...body };
    const result = await this.publisherSerivce.createPublisher(input);
    return plainToInstance(CreatePublisherResponse, result, {
      excludeExtraneousValues: true
    });
  }

  @Get('/search')
  async search(@QueryParam('publisherName') publisherName?: string) {
    const result = await this.publisherSerivce.search({ publisherName });
    return result.map(map =>
      plainToInstance(CreatePublisherResponse, map, { excludeExtraneousValues: true })
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const result = await this.publisherSerivce.getById(params.id);
    return plainToInstance(CreatePublisherResponse, result, {
      excludeExtraneousValues: true
    });
  }


  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdatePublisherRequest
  ) {
    const input: UpdatePublisherInput = { publisherId: params.id, ...req };
    const publisher = await this.publisherSerivce.partialUpdate(input);
    return plainToInstance(UpdatePublisherResponse, publisher, {
      excludeExtraneousValues: true
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.publisherSerivce.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
  return this.publisherSerivce.inactivePublisher(id);
}

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
  return this.publisherSerivce.restore(id);
  
  }
}
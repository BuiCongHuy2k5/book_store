import { Logger } from '@Decorators/Logger';
import { CreatePublisherRequest } from '@Rests/types/CreatePublisherRequest';
import { UpdatePublisherRequest } from '@Rests/types/UpdatePublisherRequest';
import { PublisherService } from '@Services/PublisherService';
import { CreatePublisherInput } from '@Services/types/CreatePublisherInput';
import { UpdatePublisherInput } from '@Services/types/UpdatePublisherInput';
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import winston from 'winston';

@Service()
@JsonController('/publisher')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class PublisherController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly publisherSerivce: PublisherService,
  ) {}

  @Post('/')
  async create(@Body() body: CreatePublisherRequest) {
    const input: CreatePublisherInput = { ...body };
    const result = await this.publisherSerivce.createPublisher(input);
    return result;
  }

  @Get('/search')
  async search(@QueryParam('publisherName') publisherName?: string) {
    const result = await this.publisherSerivce.search({ publisherName });
    return result;
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const result = await this.publisherSerivce.getById(params.id);
    return result;
  }

  @Patch('/:id')
  async partialUpdate(@Params() params: { id: number }, @Body({ validate: true }) req: UpdatePublisherRequest) {
    const input: UpdatePublisherInput = { id: params.id, ...req };
    const publisher = await this.publisherSerivce.partialUpdate(input);
    return publisher;
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

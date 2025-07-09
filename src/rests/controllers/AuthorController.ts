import {
  Body,
  Delete,
  Get,
  JsonController,
  Params,
  Patch,
  Post,
  QueryParam,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import winston from 'winston';
import { Logger } from '@Decorators/Logger';
import { plainToInstance } from 'class-transformer';
import { AuthorService } from '@Services/AuthorService';
import { CreateAuthorRequest } from '@Rests/types/CreateAuthorRequest';
import { CreateAuthorResponse } from '@Rests/types/CreateAuthorRespone';
import { CreateAuthorInput } from '@Services/types/CreateAuthorInput';
import { UpdateAuthorRequest } from '@Rests/types/UpdateAuthorRequest';
import { UpdateAuthorInput } from '@Services/types/UpdateAuthorInput';

@Service()
@JsonController('/authors')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class TacGiaController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private authorService: AuthorService,
  ) {}

  @Post('/')
  async create(@Body() body: CreateAuthorRequest): Promise<CreateAuthorResponse> {
    const input: CreateAuthorInput = { ...body };
    const author = await this.authorService.createAuthor(input);
    return plainToInstance(CreateAuthorResponse, author, {
      excludeExtraneousValues: true,
    });
  }
  
 @Get('/search')
  async search(
    @QueryParam('authorCode') authorCode?: string,
    @QueryParam('authorName') authorName?: string,
  ) {
    const results = await this.authorService.search({ authorCode, authorName });
    return results.map((map) =>
      plainToInstance(CreateAuthorResponse, map, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const author = await this.authorService.getById(params.id);
    return plainToInstance(CreateAuthorResponse, author, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdateAuthorRequest,
  ) {
    const input: UpdateAuthorInput = { authorId: params.id, ...req };
    const author = await this.authorService.partialUpdate(input);
    return plainToInstance(CreateAuthorResponse, author, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.authorService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
  return this.authorService.inactivateAuthor(id);
}

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
  return this.authorService.restore(id);
  }
  
}

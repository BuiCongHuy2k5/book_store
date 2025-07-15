import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import winston from 'winston';
import { Logger } from '@Decorators/Logger';
import { plainToInstance } from "class-transformer";
import { ImageService } from "@Services/ImageService";
import { CreateImageRequest } from "@Rests/types/CreateImageRequest";
import { UpdateImageRequest } from "@Rests/types/UpdateImageRequest";
import { CreateImageInput } from "@Services/types/CreateImageInput";
import { UpdateImageInput } from "@Services/types/UpdateImageInput";
import { CreateImageResponse } from "@Rests/types/CreateImageRespone";
import { UpdateImageResponse } from "@Rests/types/UpdateImageRespone";


@Service()
@JsonController('/Image')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class ImageController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private imageService: ImageService
  ) {}

  @Post('/')
  async create(@Body() body: CreateImageRequest): Promise<CreateImageResponse> {
    const input: CreateImageInput = { ...body };
    const image = await this.imageService.createSach(input);
    return plainToInstance(CreateImageResponse, image, {
      excludeExtraneousValues: true
    });
  }

    @Get('/search')
  async search(
    @QueryParam('name') name?: string,
    @QueryParam('imageId') imageId?: number
  ) {
    const result = await this.imageService.search({ name, imageId });
    return result.map(map =>
      plainToInstance(CreateImageResponse, map, {
         excludeExtraneousValues: true 
        }),
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const book = await this.imageService.getById(params.id);
    return plainToInstance(CreateImageResponse, book, {
      excludeExtraneousValues: true
    });
  }

  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdateImageRequest
  ) {
    const input: UpdateImageInput = { imageId: params.id, ...req };
    const image = await this.imageService.partialUpdate(input);
    return plainToInstance(UpdateImageResponse, image, {
      excludeExtraneousValues: true
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.imageService.delete(params.id);
  }

//   @Patch('/:id/inactive')
//   inactivate(@Params() { id }: { id: number }) {
//   return this.bookService.inactivateBook(id);
// }

//   @Patch('/:id/restore')
//   restore(@Params() { id }: { id: number }) {
//   return this.bookService.restore(id);
  
  // }
}
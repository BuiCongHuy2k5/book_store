import { Logger } from "@Decorators/Logger";
import { ImageRepository } from "@Repositories/ImageRepository";
import Redis  from "ioredis";
import { Inject, Service } from "typedi";
import winston from "winston";
import { CreateImageInput } from "./types/CreateImageInput";
import { Image } from "databases/postgres/entities/Image";
import { BookDetail } from "databases/postgres/entities/BookDetail";
import { NotFoundError } from "routing-controllers";
import { UpdateImageInput } from "./types/UpdateImageInput";
import { DeepPartial } from "typeorm";

@Service()
export class ImageService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly imageRepo: ImageRepository
  ) {}

  async createSach(input: CreateImageInput): Promise<Image> {
    const image = new Image();
    image.link = input.link;
    image.name = input.name;
    image.size = input.size;

    image.bookDetail = { bookDetailId: input.bookDetailId } as BookDetail;

    return this.imageRepo.create(image);
  }

  async getById(imageId: number): Promise<Image> {
    const image = await this.imageRepo.getById(imageId);
  if (!image) {
    throw new NotFoundError(`IMAGE NOT FOUND ID: ${imageId}`);
  }
  return image;
  }

  async search(filters: {  imageId?: number; name?: string}): Promise<Image[]> {
    const results = await this.imageRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO IMAGE FOUND MATCHING FILTERS`);
    }
    return results;
  }

  async partialUpdate(input: UpdateImageInput): Promise<Image> {
    const image = await this.imageRepo.getById(input.imageId);
        if (!image) {
          throw new NotFoundError(`IMAGE NOT FOUND ID: ${input.imageId}`);
        }
        const { imageId, ...updateData } = input;
        return this.imageRepo.partialUpdate(imageId, updateData as DeepPartial<Image>);
  }

  async delete(imageId: number): Promise<{ message: string }> {
    const image = await this.imageRepo.getById(imageId);
    if (!image) {
      throw new NotFoundError(`IMAGE NOT FOUND ID: ${imageId}`);
    }

    await this.imageRepo.delete(imageId);
    return { message: `DELETE IMAGE ID: ${imageId}` };
  }

//   async inactivateBook(id: number): Promise<{ message: string }> {
//     const book = await this.imageRepo.getById(id);
//     if (!book) {
//       throw new NotFoundError(`BOOK NOT FOUND ID: ${id}`);
//     }
//     return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
//     }
  
//     async restore(id: number): Promise<{message: string}> {
//     const book = await this.bookRepo.getById(id);
//     if (!book) {
//       throw new NotFoundError(`BOOK NOT FOUND ID: ${id}`);
//     }
  
//     if (book.status === RestRoles.ACTIVE) {
//       return { message: `BOOK ID ${id} IS ALREADY ACTIVE` };
//     }
  
//     await this.bookRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
  
//     return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
//   }

}

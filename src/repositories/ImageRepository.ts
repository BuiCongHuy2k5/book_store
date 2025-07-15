import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { Image } from "databases/postgres/entities/Image";


@Service()
export class ImageRepository extends BaseOrmRepository<Image> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Image);
  }

  async create(Image: DeepPartial<Image>): Promise<Image> {
    return this.repo.save(Image);
  }

  async getById(imageId: number): Promise<Image | null> {
    return this.repo.findOneBy({ imageId: imageId });
  }

  async search(filters: { name?: string;}): Promise<Image[]> {
    const query = this.repo.createQueryBuilder('Image');

    if (filters.name) {
      query.andWhere('LOWER(Image.Name) LIKE LOWER(:name)', {
        name: `%${filters.name}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Image>): Promise<Image | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async isImageCodeNguExist(name : string): Promise<boolean> {
    const found = await this.repo.findOneBy({ name: name });
    return !!found;
  }

  async isImageCodeExistForOther(id: number, imageCode: string): Promise<boolean> {
    const found = await this.repo
      .createQueryBuilder('Image')
      .where('Image.ImageCode = :imageCode AND Image.ImageId != :id', { imageCode, id })
      .getOne();

    return !!found;
  }
}
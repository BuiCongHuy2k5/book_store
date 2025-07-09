import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { SachCT } from "databases/postgres/entities/BookDetail";


@Service()
export class SachCTRepository extends BaseOrmRepository<SachCT> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, SachCT);
  }

  async create(SachCT: DeepPartial<SachCT>): Promise<SachCT> {
    return this.repo.save(SachCT);
  }

  async getById(idSachCT: number): Promise<SachCT | null> {
    return this.repo.findOneBy({ idSachCT: idSachCT });
  }

  async search(filters: { maSachCT?: string;}): Promise<SachCT[]> {
    const query = this.repo.createQueryBuilder('SachCT');

    if (filters.maSachCT) {
      query.andWhere('LOWER(SachCT.MaSachCT) LIKE LOWER(:maSachCT)', {
        maSachCT: `%${filters.maSachCT}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<SachCT>): Promise<SachCT | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async isMaSachCTNguExist(maSachCT : string): Promise<boolean> {
    const found = await this.repo.findOneBy({ maSachCT: maSachCT });
    return !!found;
  }

  async isMaSachCTExistForOther(id: number, maSachCT: string): Promise<boolean> {
    const found = await this.repo
      .createQueryBuilder('SachCT')
      .where('SachCT.MaSachCT = :maSachCT AND SachCT.IdSachCT != :id', { maSachCT, id })
      .getOne();

    return !!found;
  }
}
import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { NhaXuatBan } from "databases/postgres/entities/Publisher";

@Service()
export class NhaXuatBanRepository extends BaseOrmRepository<NhaXuatBan> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, NhaXuatBan);
  }

  async create(NhaXuatBan: DeepPartial<NhaXuatBan>): Promise<NhaXuatBan> {
    return this.repo.save(NhaXuatBan);
  }

  async getById(idNXB: number): Promise<NhaXuatBan | null> {
    return this.repo.findOneBy({ idNXB: idNXB });
  }

  async search(filters: { tenNxb?: string;}): Promise<NhaXuatBan[]> {
    const query = this.repo.createQueryBuilder('NhaXuatBan');

    if (filters.tenNxb) {
      query.andWhere('LOWER(NhaXuatBan.TenNXB) LIKE LOWER(:tenNXB)', {
        tenNXB: `%${filters.tenNxb}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<NhaXuatBan>): Promise<NhaXuatBan | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async isMaSachExist(maNXB: string): Promise<boolean> {
    const found = await this.repo.findOneBy({ maNXB: maNXB });
    return !!found;
  }

  async isMaSachExistForOther(id: number, maNXB: string): Promise<boolean> {
    const found = await this.repo
      .createQueryBuilder('NhaXuatBan')
      .where('NhaXuatBan.MaNXB = :maNXB AND NhaXuatBan.IdNXB != :id', { maNXB, id })
      .getOne();

    return !!found;
  }
}
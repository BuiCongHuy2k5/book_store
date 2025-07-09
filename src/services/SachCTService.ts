import { Inject, Service } from 'typedi';
import Redis from 'ioredis';
import winston from 'winston';

import { Logger } from '@Decorators/Logger';
import { NotFoundError } from '@Errors/NotFoundError';
import { DeepPartial } from 'typeorm';
import { RestRoles } from '@Enums/RestRoles';
import { SachCTRepository } from '@Repositories/SachCTRepository';
import { CreateSachCTInput } from './types/CreateBookDetailInput';
import { UpdateSachCTInput } from './types/UpdateBookDetailInput';
import { SachCT } from 'databases/postgres/entities/BookDetail';

@Service()
export class SachCTService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly sachCTRepo: SachCTRepository
  ) {}

  async createSachCT(input: CreateSachCTInput): Promise<SachCT> {
    const sachCT = new SachCT();
    sachCT.maSachCT = input.maSachCT;
    sachCT.idSach = input.idSach;
    sachCT.idTacGia = input.idTacGia;
    sachCT.idNXB = input.idNXB;
    sachCT.idNgonNgu = input.idNgonNgu;
    sachCT.soTrang = input.soTrang;
    sachCT.soLuong = input.soLuong;
    sachCT.gia = input.gia;
    sachCT.moTa = input.moTa;
    sachCT.status = RestRoles.ACTIVE;

    return this.sachCTRepo.create(sachCT);
  }

  async getById(id: number): Promise<SachCT> {
    const sachCT = await this.sachCTRepo.getById(id);
    if (!sachCT) {
      throw new NotFoundError(`SACHCT NOT FOUND ID: ${id}`);
    }
    return sachCT;
  }

  async search(filters: { maSachCT?: string }): Promise<SachCT[]> {
    const results = await this.sachCTRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO SACHCT FOUND MATCHING FILTERS`);
    }
    return results;
  }

  async partialUpdate(input: UpdateSachCTInput): Promise<SachCT> {
    const sachCT = await this.sachCTRepo.getById(input.idSachCT);
    if (!sachCT) {
      throw new NotFoundError(`SACHCT NOT FOUND ID: ${input.idSachCT}`);
    }
    const { idSachCT, ...updateData } = input;
    return this.sachCTRepo.partialUpdate(idSachCT, updateData as DeepPartial<SachCT>);
  }

  async delete(id: number): Promise<{ message: string }> {
    const sachCT = await this.sachCTRepo.getById(id);
    if (!sachCT) {
      throw new NotFoundError(`SACHCT NOT FOUND ID: ${id}`);
    }
    await this.sachCTRepo.delete(id);
    return { message: `DELETE SACHCT ID: ${id}` };
  }

  async inactivateSachCT(id: number): Promise<{ message: string }> {
    const sachCT = await this.sachCTRepo.getById(id);
    if (!sachCT) {
      throw new NotFoundError(`SACHCT NOT FOUND ID: ${id}`);
    }
    await this.sachCTRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
    return { message: `SACHCT ID ${id} IS NOW INACTIVE` };
  }

  async restore(id: number): Promise<{ message: string }> {
    const sachCT = await this.sachCTRepo.getById(id);
    if (!sachCT) {
      throw new NotFoundError(`SACHCT NOT FOUND ID: ${id}`);
    }
    if (sachCT.status === RestRoles.ACTIVE) {
      return { message: `SACHCT ID ${id} IS ALREADY ACTIVE` };
    }
    await this.sachCTRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
    return { message: `SACHCT ID ${id} IS NOW ACTIVE` };
  }
}
import { Logger } from "@Decorators/Logger";
import { NhaXuatBanRepository } from "@Repositories/NhaXuatBanRepository";
import Redis  from "ioredis";
import { Inject, Service } from "typedi";
import winston from "winston";
import { CreateNhaXuatBanInput } from "./types/CreatePublisherInput";
import { RestRoles } from "@Enums/RestRoles";
import { NotFoundError } from "routing-controllers";
import { UpdateNhaXuatBanInput } from "./types/UpdatePublisherInput";
import { DeepPartial } from "typeorm";
import { NhaXuatBan } from "databases/postgres/entities/Publisher";

@Service()
export class NhaXuatBanService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly NxbRepo: NhaXuatBanRepository
  ) {}

  async createNxb(input: CreateNhaXuatBanInput): Promise<NhaXuatBan> {
    const Nxb = new NhaXuatBan();
    Nxb.maNXB = input.maNXB;
    Nxb.tenNXB = input.tenNXB;
    Nxb.status = RestRoles.ACTIVE;

    return this.NxbRepo.create(Nxb);
  }

  async getById(idNXB: number): Promise<NhaXuatBan> {
    const Nxb = await this.NxbRepo.getById(idNXB);
    if (!Nxb) {
      throw new NotFoundError(`NXB NOT FOUND ID: ${idNXB}`);
    }
    return Nxb;
  }

  async search(filters: { tenNxb?: string }): Promise<NhaXuatBan[]> {
      const results = await this.NxbRepo.search(filters);
      if (results.length === 0) {
        throw new NotFoundError(`NO NXB FOUND MATCHING FILTERS`);
      }
      return results;
    }

  async partialUpdate(input: UpdateNhaXuatBanInput): Promise<NhaXuatBan> {
    const Nxb = await this.NxbRepo.getById(input.id);
    if (!Nxb) {
      throw new NotFoundError(`NXB NOT FOUND`);
    }
  
    const { id, ...updateData } = input;
  
    return this.NxbRepo.partialUpdate(id, updateData as DeepPartial<NhaXuatBan>);
  }

  async delete(idNXB: number): Promise<{ message: string }> {
    const Nxb = await this.NxbRepo.getById(idNXB);
    if (!Nxb) {
      throw new NotFoundError(`NXB NOT FOUND ID: ${idNXB}`);
    }

    await this.NxbRepo.delete(idNXB);
    return { message: `DELETE PUBLISH ID: ${idNXB}` };
  }

  async inactiveNXB(id: number): Promise<{ message: string }> {
    const Nxb = await this.NxbRepo.getById(id);
    if (!Nxb) {
      throw new NotFoundError(`NXB NOT FOUND ID: ${id}`);
    }
  
    await this.NxbRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
    }
  
    async restore(id: number): Promise<{message: string}> {
    const Nxb = await this.NxbRepo.getById(id);
    if (!Nxb) {
      throw new NotFoundError(`NXB NOT FOUND ID: ${id}`);
    }
  
    if (Nxb.status === RestRoles.ACTIVE) {
      return { message: `PUBLISH ID ${id} IS ALREADY ACTIVE` };
    }
  
    await this.NxbRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

}

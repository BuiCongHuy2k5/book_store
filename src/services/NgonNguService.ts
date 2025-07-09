import { Logger } from "@Decorators/Logger";
import { NgonNguRepository } from "@Repositories/NgonNguRepository";
import  Redis  from "ioredis";
import { Inject, Service } from "typedi";
import winston from "winston";
import { CreateNgonNguInput } from "./types/CreateNgonNguInput";
import { RestRoles } from "@Enums/RestRoles";
import { NotFoundError } from "routing-controllers";
import { UpdateNgonNguInput } from "./types/UpdateNgonNguInput";
import { DeepPartial } from "typeorm";
import { NgonNgu } from "databases/postgres/entities/NgonNgu";

@Service()
export class NgonNguService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis.Redis,
    private readonly NgonNguRepo: NgonNguRepository
  ) {}

  async createNxb(input: CreateNgonNguInput): Promise<NgonNgu> {
    const ngonNgu = new NgonNgu();
    ngonNgu.maNgonNgu = input.maNgonNgu;
    ngonNgu.tenNgonNgu = input.tenNgonNgu;
    ngonNgu.status = RestRoles.ACTIVE;

    return this.NgonNguRepo.create(ngonNgu);
  }

  async getById(idNgonNgu: number): Promise<NgonNgu> {
    const ngonNgu = await this.NgonNguRepo.getById(idNgonNgu);
    if (!ngonNgu) {
      throw new NotFoundError(`LANGUAGE NOT FOUND ID: ${idNgonNgu}`);
    }
    return ngonNgu;
  }

  async search(filters: { tenNgonNgu?: string }): Promise<NgonNgu[]> {
      const results = await this.NgonNguRepo.search(filters);
      if (results.length === 0) {
        throw new NotFoundError(`NO LANGUAGE FOUND MATCHING FILTERS`);
      }
      return results;
    }

  async partialUpdate(input: UpdateNgonNguInput): Promise<NgonNgu> {
    const ngonNgu = await this.NgonNguRepo.getById(input.id);
    if (!ngonNgu) {
      throw new NotFoundError(`LANGUAGE NOT FOUND`);
    }
  
    const { id, ...updateData } = input;
  
    return this.NgonNguRepo.partialUpdate(id, updateData as DeepPartial<NgonNgu>);
  }

  async delete(idNgonNgu: number): Promise<{ message: string }> {
    const ngonNgu = await this.NgonNguRepo.getById(idNgonNgu);
    if (!ngonNgu) {
      throw new NotFoundError(`NXB NOT FOUND ID: ${idNgonNgu}`);
    }

    await this.NgonNguRepo.delete(idNgonNgu);
    return { message: `DELETE LANGUAGE ID: ${idNgonNgu}` };
  }

  async inactiveLanguage(id: number): Promise<{ message: string }> {
    const ngonNgu = await this.NgonNguRepo.getById(id);
    if (!ngonNgu) {
      throw new NotFoundError(`LANGUAGE NOT FOUND ID: ${id}`);
    }
  
    await this.NgonNguRepo.partialUpdate(id, { status: RestRoles.INACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
    }
  
    async restore(id: number): Promise<{message: string}> {
    const ngonNgu = await this.NgonNguRepo.getById(id);
    if (!ngonNgu) {
      throw new NotFoundError(`LANGUAGE NOT FOUND ID: ${id}`);
    }
  
    if (ngonNgu.status === RestRoles.ACTIVE) {
      return { message: `LANGUAGE ID ${id} IS ALREADY ACTIVE` };
    }
  
    await this.NgonNguRepo.partialUpdate(id, { status: RestRoles.ACTIVE });
  
    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

}
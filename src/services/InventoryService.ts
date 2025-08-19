import { Inject, Service } from 'typedi';
import { Logger } from '@Decorators/Logger';
import winston from 'winston';
import Redis from 'ioredis';
import { DeepPartial } from 'typeorm';
import { NotFoundError } from 'routing-controllers';
import { INVENTORY } from '@Enums/RestRoles';
import { BookRepository } from '@Repositories/BookRepository';
import { Inventory } from 'databases/postgres/entities/Inventory';
import { CreateInventoryInput } from './types/CreateInventoryInput';
import { InventoryRepository } from '@Repositories/InventoryRepository';
import { UpdateInventoryInput } from './types/UpdateInventoryInput';

@Service()
export class InventoryService {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    @Inject('cache') private readonly cache: Redis,
    private readonly inventoryRepo: InventoryRepository,
    private readonly bookRepo: BookRepository,
  ) { }

  async updateInventoryStatus(inventory: Inventory): Promise<INVENTORY> {
    const { quantity = 0, minThreshold = 0, maxThreshold } = inventory;

    if (quantity === 0) return INVENTORY.OUT_OF_STOCK;
    if (quantity < minThreshold) return INVENTORY.LOW_STOCK;
    if (maxThreshold != null && quantity > maxThreshold) return INVENTORY.OVER_STOCK;

    return INVENTORY.IN_STOCK;
  }

  async getInventoryWarning(inventory: Inventory): Promise<string | null> {
    switch (inventory.status) {
      case INVENTORY.LOW_STOCK:
        return 'WARNING: LOW INVENTORY, NEED TO REPLACE!';
      case INVENTORY.OVER_STOCK:
        return 'WARNING: INVENTORY EXCESSED!!!';
      case INVENTORY.IN_STOCK:
        return 'AVAILABLE';
      case INVENTORY.OUT_OF_STOCK:
        return 'PRODUCT NO LONGER IN OPERATION';
      default:
        return null;
    }
  }

  async createInventory(input: CreateInventoryInput): Promise<Inventory> {
    const book = await this.bookRepo.getById(input.bookId);
    if (!book) {
      throw new NotFoundError(`Book with NAME ${input.bookId} not found`);
    }

    const inventory = new Inventory();
    inventory.book = book;
    inventory.quantity = input.quantity;
    inventory.minThreshold = input.minThreshold;
    inventory.maxThreshold = input.maxThreshold;
    inventory.location = input.location;
    inventory.status = await this.updateInventoryStatus(inventory);
    return this.inventoryRepo.create(inventory);
  }

  async getById(id: number): Promise<any> {
    const inventory = await this.inventoryRepo.getById(id);
    if (!inventory) {
      throw new NotFoundError(`INVENTORY NOT FOUND ID: ${id}`);
    }
    const warning = await this.getInventoryWarning(inventory);
    return {
      ...inventory,
      warning,
    };
  }

  async search(filters: { status?: string; quantity?: number }): Promise<Inventory[]> {
    const results = await this.inventoryRepo.search(filters);
    if (results.length === 0) {
      throw new NotFoundError(`NO INVENTORY FOUND MATCHING FILTERS`);
    }

    const inventory = await Promise.all(
      results.map(async inventory => ({
        ...inventory,
        warning: await this.getInventoryWarning(inventory),
      })),
    );

    return inventory;
  }

  async partialUpdate(input: UpdateInventoryInput): Promise<Inventory> {
    const { id, bookId, ...otherData } = input;
    const inventory = await this.inventoryRepo.getById(input.id);

    if (!inventory) {
      throw new NotFoundError(`INVENTORY NOT FOUND ${input.id}`);
    }

    const updateData: Partial<Inventory> = { ...otherData };

    if (bookId) {
      const book = await this.bookRepo.getById(bookId);
      if (!book) throw new NotFoundError('BOOK_NOT_FOUND');
      updateData.book = book;
    }

    const merged = { ...inventory, ...updateData };
    updateData.status = await this.updateInventoryStatus(merged);
    return this.inventoryRepo.partialUpdate(id, updateData as DeepPartial<Inventory>);
  }

  async delete(id: number): Promise<{ message: string }> {
    const inventory = await this.inventoryRepo.getById(id);
    if (!inventory) {
      throw new NotFoundError(`INVENTORY NOT FOUND ID: ${id}`);
    }

    await this.inventoryRepo.delete(id);
    return { message: `DELETE INVENTORY ID: ${id}` };
  }

  async outOfStock(id: number): Promise<{ message: string }> {
    const inventory = await this.inventoryRepo.getById(id);
    if (!inventory) {
      throw new NotFoundError(`INVENTORY NOT FOUND ID: ${id}`);
    }

    await this.inventoryRepo.partialUpdate(id, { status: INVENTORY.OUT_OF_STOCK });

    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }

  async restore(id: number): Promise<{ message: string }> {
    const inventory = await this.inventoryRepo.getById(id);
    if (!inventory) {
      throw new NotFoundError(`INVENTORY NOT FOUND ID: ${id}`);
    }

    if (inventory.status === INVENTORY.IN_STOCK) {
      return { message: `INVENTORY ID ${id} IS ALREADY ACTIVE` };
    }

    await this.inventoryRepo.partialUpdate(id, { status: INVENTORY.IN_STOCK });

    return { message: `CHANGE ID STATUS SUCCESSFULLY ${id}` };
  }
}

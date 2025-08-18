import { Logger } from '@Decorators/Logger';
import { CreateInventoryRequest } from '@Rests/types/CreateInventoryRequest';
import { UpdateInventoryRequest } from '@Rests/types/UpdateInventoryRequest';
import { InventoryService } from '@Services/InventoryService';
import { CreateInventoryInput } from '@Services/types/CreateInventoryInput';
import { UpdateInventoryInput } from '@Services/types/UpdateInventoryInput';
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import winston from 'winston';

@Service()
@JsonController('/stock')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class InventoryController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly inventoryService: InventoryService,
  ) {}

  @Post('/')
  async create(@Body() body: CreateInventoryRequest) {
    const input: CreateInventoryInput = { ...body };
    const result = await this.inventoryService.createInventory(input);
    return result;
  }

  @Get('/search')
  async search(@QueryParam('status') status?: string, @QueryParam('quantity') quantity?: number) {
    const result = await this.inventoryService.search({ status, quantity });
    return result;
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const result = await this.inventoryService.getById(params.id);
    return result;
  }

  @Patch('/:id')
  async partialUpdate(@Params() params: { id: number }, @Body({ validate: true }) req: UpdateInventoryRequest) {
    const input: UpdateInventoryInput = { id: params.id, ...req };
    const inventory = await this.inventoryService.partialUpdate(input);
    return inventory;
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.inventoryService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
    return this.inventoryService.outOfStock(id);
  }

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
    return this.inventoryService.restore(id);
  }
}

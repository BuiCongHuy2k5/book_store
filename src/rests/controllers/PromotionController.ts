import { Logger } from "@Decorators/Logger";
import { CreatePromotionRequest } from "@Rests/types/CreatePromotionRequest";
import { CreatePromotionResponse } from "@Rests/types/CreatePromotionRespone";
import { UpdatePromotionRequest } from "@Rests/types/UpdatePromotionRequest";
import { UpdatePromotionResponse } from "@Rests/types/UpdatePromotionRespone";
import { PromotionService } from "@Services/PromotionService";
import { CreatePromotionInput } from "@Services/types/CreatePromotionInput";
import { UpdatePromotionInput } from "@Services/types/UpdatePromotionInput";
import { plainToInstance } from "class-transformer";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import winston from "winston";

@Service()
@JsonController('/Promotion')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class PromotionController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly promotionService: PromotionService
  ) {}

  @Post('/')
  async create(@Body() body: CreatePromotionRequest): Promise<CreatePromotionResponse> {
    const input: CreatePromotionInput = { ...body };
    const promotion = await this.promotionService.createPromotion(input);
    return plainToInstance(CreatePromotionResponse, promotion, {
      excludeExtraneousValues: true
    });
  }

  @Get('/search')
  async search(@QueryParam('promotionName') promotionName?: string) {
    const result = await this.promotionService.search({ promotionName });
    return result.map(map =>
      plainToInstance(CreatePromotionResponse, map, { excludeExtraneousValues: true })
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const result = await this.promotionService.getById(params.id);
    return plainToInstance(CreatePromotionResponse, result, {
      excludeExtraneousValues: true
    });
  }


  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdatePromotionRequest
  ) {
    const input: UpdatePromotionInput = { promotionId: params.id, ...req };
    const promotion = await this.promotionService.partialUpdate(input);
    return plainToInstance(UpdatePromotionResponse, promotion, {
      excludeExtraneousValues: true
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.promotionService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
  return this.promotionService.inactivePromotion(id);
}

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
  return this.promotionService.restore(id);
  }
}
import { Logger } from "@Decorators/Logger";
import { CreatePaymentMethodRequest } from "@Rests/types/CreatePaymentMethodRequest";
import { CreatePaymentMethodResponse } from "@Rests/types/CreatePaymentMethodRespone";
import { UpdatePaymentMethodRequest } from "@Rests/types/UpdatePaymentMethodRequest";
import { UpdatePaymentMethodResponse } from "@Rests/types/UpdatePaymentMethodRespone";
import { PaymentMethodService } from "@Services/PaymentMethodService";
import { CreatePaymentMethodInput } from "@Services/types/CreatePaymentMethodInput";
import { UpdatePaymentMethodInput } from "@Services/types/UpdatePaymentMethodInput";
import { plainToInstance } from "class-transformer";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import winston from "winston";

@Service()
@JsonController('/PaymentMethod')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class PromotionController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly paymentMethodService: PaymentMethodService
  ) {}

  @Post('/')
  async create(@Body() body: CreatePaymentMethodRequest): Promise<CreatePaymentMethodResponse> {
    const input: CreatePaymentMethodInput = { ...body };
    const paymentMethod = await this.paymentMethodService.createPaymentMethod(input);
    return plainToInstance(CreatePaymentMethodResponse, paymentMethod, {
      excludeExtraneousValues: true
    });
  }

  @Get('/search')
  async search(@QueryParam('name') name?: string) {
    const result = await this.paymentMethodService.search({ name });
    return result.map(map =>
      plainToInstance(CreatePaymentMethodResponse, map, { excludeExtraneousValues: true })
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const result = await this.paymentMethodService.getById(params.id);
    return plainToInstance(CreatePaymentMethodResponse, result, {
      excludeExtraneousValues: true
    });
  }


  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdatePaymentMethodRequest
  ) {
    const input: UpdatePaymentMethodInput = { paymentMethodId: params.id, ...req };
    const paymentMethod = await this.paymentMethodService.partialUpdate(input);
    return plainToInstance(UpdatePaymentMethodResponse, paymentMethod, {
      excludeExtraneousValues: true
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.paymentMethodService.delete(params.id);
  }

//   @Patch('/:id/inactive')
//   inactivate(@Params() { id }: { id: number }) {
//   return this.promotionService.inactivePromotion(id);
// }

//   @Patch('/:id/restore')
//   restore(@Params() { id }: { id: number }) {
//   return this.promotionService.restore(id);
//   }
}
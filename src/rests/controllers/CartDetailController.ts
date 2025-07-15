import { Logger } from "@Decorators/Logger";
import { CreateCartDetailRequest } from "@Rests/types/CreateCartDetailRequest";
import { CreateCartDetailResponse } from "@Rests/types/CreateCartDetailRespone";
import { UpdateCartDetailRequest } from "@Rests/types/UpdateCartDetailRequest";
import { UpdateCartDetailResponse } from "@Rests/types/UpdateCartDetailRespone";
import { CartDetailService } from "@Services/CartDetailService";
import { CreateCartDetailInput } from "@Services/types/CreateCartDetailInput";
import { UpdateCartDetailInput } from "@Services/types/UpdateCartDetailInput";
import { plainToInstance } from "class-transformer";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import winston from "winston";

@Service()
@JsonController('/CartDetail')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class CartDetailController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly cartDetaiService: CartDetailService
  ) {}

  @Post('/')
  async create(@Body() body: CreateCartDetailRequest): Promise<CreateCartDetailResponse> {
    const input: CreateCartDetailInput = { ...body };
    const result = await this.cartDetaiService.createCartDetail(input);
    return plainToInstance(CreateCartDetailResponse, result, {
      excludeExtraneousValues: true
    });
  }

  @Get('/search')
  async search(@QueryParam('cartId') cartId?: string) {
    const result = await this.cartDetaiService.search({ cartId });
    return result.map(map =>
      plainToInstance(CreateCartDetailResponse, map, { excludeExtraneousValues: true })
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const result = await this.cartDetaiService.getById(params.id);
    return plainToInstance(CreateCartDetailResponse, result, {
      excludeExtraneousValues: true
    });
  }


  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdateCartDetailRequest
  ) {
    const input: UpdateCartDetailInput = { cartDetailId: params.id, ...req };
    const cartDetail = await this.cartDetaiService.partialUpdate(input);
    return plainToInstance(UpdateCartDetailResponse, cartDetail, {
      excludeExtraneousValues: true
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.cartDetaiService.delete(params.id);
  }

//   @Patch('/:id/inactive')
//   inactivate(@Params() { id }: { id: number }) {
//   return this.cartService.inactiveCart(id);
// }

//   @Patch('/:id/restore')
//   restore(@Params() { id }: { id: number }) {
//   return this.cartService.restore(id);
//   }
}
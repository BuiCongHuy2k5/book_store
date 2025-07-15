import { Logger } from "@Decorators/Logger";
import { CreateCartRequest } from "@Rests/types/CreateCartRequest";
import { CreateCartResponse } from "@Rests/types/CreateCartRespone";
import { UpdateCartRequest } from "@Rests/types/UpdateCartRequest";
import { UpdateCartResponse } from "@Rests/types/UpdateCartRespone";
import { CartService } from "@Services/CartService";
import { CreateCartInput } from "@Services/types/CreateCartInput";
import { UpdateCartInput } from "@Services/types/UpdateCartInput";
import { plainToInstance } from "class-transformer";
import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import winston from "winston";

@Service()
@JsonController('/Cart')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class CartController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private readonly cartService: CartService
  ) {}

  @Post('/')
  async create(@Body() body: CreateCartRequest): Promise<CreateCartResponse> {
    const input: CreateCartInput = { ...body };
    const result = await this.cartService.createCart(input);
    return plainToInstance(CreateCartResponse, result, {
      excludeExtraneousValues: true
    });
  }

  @Get('/search')
  async search(@QueryParam('cartCode') cartCode?: string) {
    const result = await this.cartService.search({ cartCode });
    return result.map(map =>
      plainToInstance(CreateCartResponse, map, { excludeExtraneousValues: true })
    );
  }

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const result = await this.cartService.getById(params.id);
    return plainToInstance(CreateCartResponse, result, {
      excludeExtraneousValues: true
    });
  }


  @Patch('/:id')
  async partialUpdate(
    @Params() params: { id: number },
    @Body({ validate: true }) req: UpdateCartRequest
  ) {
    const input: UpdateCartInput = { cartId: params.id, ...req };
    const cart = await this.cartService.partialUpdate(input);
    return plainToInstance(UpdateCartResponse, cart, {
      excludeExtraneousValues: true
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.cartService.delete(params.id);
  }

  @Patch('/:id/inactive')
  inactivate(@Params() { id }: { id: number }) {
  return this.cartService.inactiveCart(id);
}

  @Patch('/:id/restore')
  restore(@Params() { id }: { id: number }) {
  return this.cartService.restore(id);
  }
}
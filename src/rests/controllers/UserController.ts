import { Body, Delete, Get, JsonController, Params, Post, Put, QueryParam, Req, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import winston from 'winston';
import { Service } from 'typedi';

import { Logger } from '@Decorators/Logger';




import { ConfigService } from '@Services/ConfigService';
import { UserService } from '@Services/UserService';
import { CreateUserRequest } from '@Rests/types/CreateUserRequest';
import { plainToInstance } from 'class-transformer';
import { CreateUserResponse } from '@Rests/types/CreateUserRespone';
import { UpdateUserRequest } from '@Rests/types/UpdateUserRequest';
import { UpdateUserRespone } from '@Rests/types/UpdateUserRespone';
import { UpdateUserInput } from '@Services/types/UpdateUserInput';
import { CreateUserInput } from '@Services/types/CreateUserInput';
import { LoginUserRespone } from '@Rests/types/LoginUserRespone';
import { LoginUserRequest } from '@Rests/types/LoginUserRequest';
import { AuthenticationMiddleware } from '@Middlewares/rest/AuthenticationMiddleware';
import { Request } from 'express';


@Service()
@JsonController('/users')
@OpenAPI({ security: [{ BearerToken: [] }] })
export class UserController {
  constructor(
    @Logger(module) private readonly logger: winston.Logger,
    private userService: UserService,
  ) {}

  @Post('/register')
  async register(@Body() body: CreateUserRequest): Promise<CreateUserResponse> {
    const input: CreateUserInput = { ...body };
    const user = await this.userService.register(input);
    return plainToInstance(CreateUserResponse, user, {
      excludeExtraneousValues: true
    });
  }

  @Post('/login')
  async login(@Body() body: LoginUserRequest): Promise<LoginUserRespone> {
    const { token, user } = await this.userService.login(body.email, body.passWord);

    return plainToInstance(LoginUserRespone, {
      token,
      user: plainToInstance(CreateUserResponse, user, {
        excludeExtraneousValues: true
      })
    });
  }

  @Post('/')
  async create(@Body() body: CreateUserRequest): Promise<CreateUserResponse> {
    const user = await this.userService.createUser(body);
    return plainToInstance(CreateUserResponse, user, {
      excludeExtraneousValues: true
    });
  }

  @Get('/search')
async search(
  @QueryParam('name') name?: string,
  @QueryParam('email') email?: string,
    @QueryParam('birtDate') birtDate?: Date,
) {
  return this.userService.search({ name, email, birtDate});
}

  @Get('/:id')
  async getById(@Params() params: { id: number }) {
    const user = await this.userService.getById(params.id);
    return plainToInstance(CreateUserResponse, user, { excludeExtraneousValues: true });
  }

  @Put('/:id')
  async update(
    @Params() params: { id: number },
    @Body() body: UpdateUserRequest
  ): Promise<UpdateUserRespone> {
    const input: UpdateUserInput = { id: params.id, ...body };
    const updatedUser = await this.userService.update(input);
    return plainToInstance(UpdateUserRespone, updatedUser, {
      excludeExtraneousValues: true
    });
  }

  @Delete('/:id')
  async delete(@Params() params: { id: number }) {
    return this.userService.delete(params.id);
  }

  @Get('/me')
  async getMe(@Req() req: Request) {
    const userId = (req as any).identity;

    if (!userId) {
      throw new Error('Không xác thực được người dùng');
    }

    const user = await this.userService.getById(userId);
    return {
      message: 'Thông tin người dùng từ token',
      user: plainToInstance(CreateUserResponse, user, {
        excludeExtraneousValues: true
      })
    };
  }

}

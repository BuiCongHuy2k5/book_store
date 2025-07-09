// import { Logger } from "@Decorators/Logger";
// import { CreateSachCTRequest } from "@Rests/types/CreateBookDetailRequest";
// import { CreateSachCTRespone } from "@Rests/types/CreateBookDetailRespone";
// import { UpdateSachCTRequest } from "@Rests/types/UpdateBookDetailRequest";
// import { UpdateSachCTResponse } from "@Rests/types/UpdateBookDetailRespone";
// import { SachCTService } from "@Services/SachCTService";
// import { CreateSachCTInput } from "@Services/types/CreateBookDetailInput";
// import { UpdateSachCTInput } from "@Services/types/UpdateBookDetailInput";
// import { plainToInstance } from "class-transformer";
// import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from "routing-controllers";
// import { OpenAPI } from "routing-controllers-openapi";
// import { Service } from "typedi";
// import winston from "winston";

// @Service()
// @JsonController('/SachCT')
// @OpenAPI({ security: [{ BearerToken: [] }] })
// export class SachCTController {
//   constructor(
//     @Logger(module) private readonly logger: winston.Logger,
//     private readonly sachCTService: SachCTService
//   ) {}

//   @Post('/')
//   async create(@Body() body: CreateSachCTRequest): Promise<CreateSachCTRespone> {
//     const input: CreateSachCTInput = { ...body };
//     const result = await this.sachCTService.createSachCT(input);
//     return plainToInstance(CreateSachCTRespone, result, {
//       excludeExtraneousValues: true
//     });
//   }

//   @Get('/search')
//   async search(@QueryParam('maSachCT') maSachCT?: string) {
//     const result = await this.sachCTService.search({ maSachCT });
//     return result.map(map =>
//       plainToInstance(CreateSachCTRespone, map, { excludeExtraneousValues: true })
//     );
//   }

//   @Get('/:id')
//   async getById(@Params() params: { id: number }) {
//     const result = await this.sachCTService.getById(params.id);
//     return plainToInstance(CreateSachCTRespone, result, {
//       excludeExtraneousValues: true
//     });
//   }


//   @Patch('/:id')
//   async partialUpdate(
//     @Params() params: { id: number },
//     @Body({ validate: true }) req: UpdateSachCTRequest
//   ) {
//     const input: UpdateSachCTInput = { idSachCT: params.id, ...req };
//     const sachCT = await this.sachCTService.partialUpdate(input);
//     return plainToInstance(UpdateSachCTResponse, sachCT, {
//       excludeExtraneousValues: true
//     });
//   }

//   @Delete('/:id')
//   async delete(@Params() params: { id: number }) {
//     return this.sachCTService.delete(params.id);
//   }

//   @Patch('/:id/inactive')
//   inactivate(@Params() { id }: { id: number }) {
//   return this.sachCTService.inactivateSachCT(id);
// }

//   @Patch('/:id/restore')
//   restore(@Params() { id }: { id: number }) {
//   return this.sachCTService.restore(id);
//   }
// }
// import { Logger } from "@Decorators/Logger";
// import { CreateNhaXuatBanRequest } from "@Rests/types/CreatePublisherRequest";
// import { CreateNhaXuatBanResponse } from "@Rests/types/CreatePublisherRespone";
// import { UpdateNhaXuatBanRequest } from "@Rests/types/UpdatePublisherRequest";
// import { UpdateNhaXuatBanRespone } from "@Rests/types/UpdatePublisherRespone";
// import { NhaXuatBanService } from "@Services/NhaXuatBanService";
// import { CreateNhaXuatBanInput } from "@Services/types/CreatePublisherInput";
// import { UpdateNhaXuatBanInput } from "@Services/types/UpdatePublisherInput";
// import { plainToInstance } from "class-transformer";
// import { Body, Delete, Get, JsonController, Params, Patch, Post, QueryParam } from "routing-controllers";
// import { OpenAPI } from "routing-controllers-openapi";
// import { Service } from "typedi";
// import winston from "winston";

// @Service()
// @JsonController('/Nxb')
// @OpenAPI({ security: [{ BearerToken: [] }] })
// export class NhaXuanBanController {
//   constructor(
//     @Logger(module) private readonly logger: winston.Logger,
//     private readonly NhaXuatBanService: NhaXuatBanService
//   ) {}

//   @Post('/')
//   async create(@Body() body: CreateNhaXuatBanRequest): Promise<CreateNhaXuatBanResponse> {
//     const input: CreateNhaXuatBanInput = { ...body };
//     const result = await this.NhaXuatBanService.createNxb(input);
//     return plainToInstance(CreateNhaXuatBanResponse, result, {
//       excludeExtraneousValues: true
//     });
//   }

//   @Get('/search')
//   async search(@QueryParam('tenNXB') tenNxb?: string) {
//     const result = await this.NhaXuatBanService.search({ tenNxb });
//     return result.map(map =>
//       plainToInstance(CreateNhaXuatBanResponse, map, { excludeExtraneousValues: true })
//     );
//   }

//   @Get('/:id')
//   async getById(@Params() params: { id: number }) {
//     const result = await this.NhaXuatBanService.getById(params.id);
//     return plainToInstance(CreateNhaXuatBanResponse, result, {
//       excludeExtraneousValues: true
//     });
//   }


//   @Patch('/:id')
//   async partialUpdate(
//     @Params() params: { id: number },
//     @Body({ validate: true }) req: UpdateNhaXuatBanRequest
//   ) {
//     const input: UpdateNhaXuatBanInput = { id: params.id, ...req };
//     const NhaXuatBan = await this.NhaXuatBanService.partialUpdate(input);
//     return plainToInstance(UpdateNhaXuatBanRespone, NhaXuatBan, {
//       excludeExtraneousValues: true
//     });
//   }

//   @Delete('/:id')
//   async delete(@Params() params: { id: number }) {
//     return this.NhaXuatBanService.delete(params.id);
//   }

//   @Patch('/:id/inactive')
//   inactivate(@Params() { id }: { id: number }) {
//   return this.NhaXuatBanService.inactiveNXB(id);
// }

//   @Patch('/:id/restore')
//   restore(@Params() { id }: { id: number }) {
//   return this.NhaXuatBanService.restore(id);
  
//   }
// }
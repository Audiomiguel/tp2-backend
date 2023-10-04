import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrderTrackingService } from './order-tracking.service';
import { CreateOrderTrackingDto } from './dto/create-order-tracking.dto';
import { SmartContractService } from './smart-contract/smart-contract.service';
import { utils } from 'web3';

@Controller('order-trackings')
export class OrderTrackingController {
  constructor(
    private readonly orderTrackingService: OrderTrackingService,
    private readonly smartContractService: SmartContractService,
  ) {}

  @Post()
  async create(@Body() createOrderTrackingDto: CreateOrderTrackingDto) {
    try {
      const tx = await this.smartContractService.createOrderTrackingTx({
        sender: createOrderTrackingDto.sender,
        orderId: createOrderTrackingDto.id,
        orderAmount: utils.toWei(createOrderTrackingDto.amount, 'mwei'),
        productName: createOrderTrackingDto.productName,
        width: Number(createOrderTrackingDto.package.dimensions.width),
        height: Number(createOrderTrackingDto.package.dimensions.height),
        length: Number(createOrderTrackingDto.package.dimensions.length),
        weight: Number(createOrderTrackingDto.package.weight)
      });

      return this.orderTrackingService.create(createOrderTrackingDto);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e?.reason ?? e.message);
    }
  }

  @Get()
  findAll() {
    return this.orderTrackingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderTrackingService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Query('status') status: string) {
    try {
      const tx = await this.smartContractService.updateOrderTrackingTx({
        id: id,
        status: status as any,
      });

      return this.orderTrackingService.update(id, status);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e?.reason ?? e.message);
    }
  }
}

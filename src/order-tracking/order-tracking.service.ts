import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderTrackingDto } from './dto/create-order-tracking.dto';

import { OrderTrackingEntity } from './entities/order-tracking.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderTrackingService {
  constructor(
    @InjectModel(OrderTrackingEntity.name)
    private orderTrackingModel: Model<OrderTrackingEntity>,
  ) {}

  create(createOrderTrackingDto: CreateOrderTrackingDto) {
    try {
      return new this.orderTrackingModel(createOrderTrackingDto).save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    return await this.orderTrackingModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} orderTracking`;
  }

  async update(id: string, status: string) {
    const orderTracking = await this.orderTrackingModel.findOne({
      id,
    });
    orderTracking.status = status as any;
    orderTracking.save();
    return {
      message: 'Order tracking updated successfully',
    };
  }

  remove(id: number) {
    return `This action removes a #${id} orderTracking`;
  }
}

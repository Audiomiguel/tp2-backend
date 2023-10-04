import { Module } from '@nestjs/common';
import { OrderTrackingService } from './order-tracking.service';
import { OrderTrackingController } from './order-tracking.controller';
import { SmartContractService } from './smart-contract/smart-contract.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderTrackingEntity,
  OrderTrackingSchema,
} from './entities/order-tracking.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrderTrackingEntity.name,
        schema: OrderTrackingSchema,
      },
    ]),
  ],
  controllers: [OrderTrackingController],
  providers: [OrderTrackingService, SmartContractService],
})
export class OrderTrackingModule {}

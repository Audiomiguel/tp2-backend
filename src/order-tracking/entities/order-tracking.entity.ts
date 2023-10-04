import { Address } from 'web3';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class OrderTracking {
  id: string;
  sender: Address;
  package: Package;
  recipient: Recipient;
  amount: bigint;
  status: 'ORDERED' | 'SHIPPED' | 'DELIVERED' | 'REFUNDED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    sender: Address,
    parcelPackage: Package,
    recipient: Recipient,
    amount: bigint,
  ) {
    this.id = id;
    this.sender = sender;
    this.package = parcelPackage;
    this.recipient = recipient;
    this.amount = amount;
  }
}

export class Recipient {
  documentType: string;
  document: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
  };

  constructor(
    documentType: string,
    document: string,
    name: string,
    address: {
      street: string;
      city: string;
      state: string;
    },
  ) {
    this.documentType = documentType;
    this.document = document;
    this.name = name;
    this.address = address;
  }
}

export class Package {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  constructor(
    weight: number,
    dimensions: {
      length: number;
      width: number;
      height: number;
    },
  ) {
    this.weight = weight;
    this.dimensions = dimensions;
  }
}

@Schema({
  collection: 'order-tracking',
})
export class OrderTrackingEntity extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  sender: Address;

  @Prop({ required: true })
  package: Package;

  @Prop({ required: true })
  recipient: Recipient;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: false, default: 'ORDERED' })
  status: 'ORDERED' | 'SHIPPED' | 'DELIVERED' | 'REFUNDED' | 'CANCELLED';

  @Prop({ required: false, default: Date.now })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;
}

export const OrderTrackingSchema =
  SchemaFactory.createForClass(OrderTrackingEntity);

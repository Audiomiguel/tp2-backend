import { Address } from 'web3';
import { Package, Recipient } from '../entities/order-tracking.entity';

export class CreateOrderTrackingDto {
  id: string;

  sender: Address;

  productName: string;

  package: Package;

  recipient: Recipient;

  amount: string;

  status: string;
}

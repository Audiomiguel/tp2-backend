import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Web3, utils } from 'web3';
import { trackingConfig } from 'src/config/tracking.contract';
import config from '../../config';

@Injectable()
export class SmartContractService {
  private web3: Web3;

  constructor(
    @Inject(config.KEY)
    readonly configService: ConfigType<typeof config>,
  ) {
    this.web3 = new Web3(configService.web3.providerUrl);

    const account = this.web3.eth.accounts.privateKeyToAccount(
      Buffer.from(configService.web3.privateKey, 'hex'),
    );

    this.web3.defaultAccount = account.address;
    this.web3.eth.accounts.wallet.add(account);
  }

  async createOrderTrackingTx(params: {
    sender: string;
    orderId: string;
    orderAmount: string;
    productName: string;
    width: number;
    height: number;
    length: number;
    weight: number;
  }) {
    const { contractAddress, contractAbi } = trackingConfig;

    const [account] = this.web3.eth.accounts.wallet;

    const trackingContract = new this.web3.eth.Contract(
      contractAbi,
      contractAddress,
    );
    const method = trackingContract.methods.createOrderTrackingFor(
      params.sender,
      params.orderId,
      params.orderAmount,
      params.productName,
      params.width,
      params.height,
      params.length,
      params.weight,
    );

    const nonce = await this.web3.eth.getTransactionCount(account.address);

    const tx = await account.signTransaction({
      from: account.address,
      to: contractAddress,
      data: method.encodeABI(),
      maxFeePerGas: 250000000000,
      maxPriorityFeePerGas: 250000000000,
      gas: 500000,
      nonce: utils.toHex(nonce),
    });

    const receipt = await this.web3.eth.sendSignedTransaction(
      tx.rawTransaction,
    );

    return {
      contractAddress: receipt.contractAddress,
      gasUsed: receipt.gasUsed,
      txHash: receipt.transactionHash,
    };
  }

  async updateOrderTrackingTx(params: {
    id: string;
    status: 'SHIPPED' | 'DELIVERED' | 'REFUNDED' | 'CANCELLED';
  }) {
    const { id, status } = params;
    const { contractAddress, contractAbi } = trackingConfig;

    const [account] = this.web3.eth.accounts.wallet;

    const trackingContract = new this.web3.eth.Contract(
      contractAbi,
      contractAddress,
    );
    const method = trackingContract.methods.updateTrackingStatus(
      id,
      this.getStatus(status),
    );
    const nonce = await this.web3.eth.getTransactionCount(account.address);

    const tx = await account.signTransaction({
      from: account.address,
      to: contractAddress,
      data: method.encodeABI(),
      maxFeePerGas: 250000000000,
      maxPriorityFeePerGas: 250000000000,
      gas: 250000,
      nonce: utils.toHex(nonce),
    });

    const receipt = await this.web3.eth.sendSignedTransaction(tx.rawTransaction);

    return {
      contractAddress: receipt.contractAddress,
      gasUsed: receipt.gasUsed,
      txHash: receipt.transactionHash,
    };
  }

  private getStatus(
    status: 'SHIPPED' | 'DELIVERED' | 'REFUNDED' | 'CANCELLED',
  ) {
    switch (status) {
      case 'SHIPPED':
        return 1;
      case 'DELIVERED':
        return 2;
      case 'REFUNDED':
        return 3;
      case 'CANCELLED':
        return 4;
    }
  }
}

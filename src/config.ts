import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  db: {
    uri: process.env.MONGO_URI,
  },
  web3: {
    providerUrl: process.env.WEB3_PROVIDER_URL,
    privateKey: process.env.WEB3_PRIVATE_KEY || '',
  }
}));

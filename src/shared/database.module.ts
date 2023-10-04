import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config/';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          uri: `${configService.db.uri}`,
        };
      },
      inject: [config.KEY],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  InternalServerErrorException,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public readonly client: RedisClientType;
  private readonly url =
    process.env.NODE_ENV! == 'production'
      ? process.env.REDIS_URL_PROD!
      : process.env.REDIS_URL_DEV!;

  constructor() {
    this.client = createClient({
      url: this.url,
    }) as RedisClientType;

    this.client.on('error', (err) => {
      console.error(`Redis Client Error: ${err}`);
      throw new InternalServerErrorException('Redis connection failed');
    });
  }

  async onModuleInit() {
    console.log('Connecting Redis Client...');
    await this.client.connect();
    console.log('Redis Client Connected.');
  }

  async onModuleDestroy() {
    console.log('Disconnecting Redis Client...');
    await this.client.quit();
    console.log('Redis Client Disconnected.');
  }
}

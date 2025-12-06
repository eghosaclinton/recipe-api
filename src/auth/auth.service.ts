import { Injectable, Body } from '@nestjs/common';
import crypto from 'node:crypto';
import { RedisService } from 'src/redis/redis.service';
// import { db } from "../db/connect";
import type { RegisterUserDto } from './dto/registerUser.dto';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private cryptoService: CryptoService,
    private redisService: RedisService,
  ) {}

  async register(noregisterUserDto: RegisterUserDto) {}
}

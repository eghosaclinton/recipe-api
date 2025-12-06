import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import type { Options } from 'argon2';

@Injectable()
export class CryptoService {
  private readonly options: Options = {
    type: 2,
    // memoryCost: 16384,
    memoryCost: 32768,
    timeCost: 3,
    parallelism: 1,
  };

  async hash(plainText: string): Promise<string> {
    return await argon2.hash(plainText, this.options);
  }

  async verify(hashedText: string, plainText: string): Promise<boolean> {
    return await argon2.verify(hashedText, plainText);
  }
}

import { Injectable } from '@nestjs/common';
import type { RegisterUserDto } from './dto/registerUser.dto';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(private cryptoService: CryptoService) {}

  async register(registerUserDto: RegisterUserDto) {}
}

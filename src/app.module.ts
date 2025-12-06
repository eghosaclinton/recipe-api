import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RecipesModule } from './recipes/recipes.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    UserModule,
    RecipesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

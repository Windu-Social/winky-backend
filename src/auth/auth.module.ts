import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { Auth, AuthSchema } from './models/auth.model';
import { MongooseModule } from '@nestjs/mongoose';

import * as jwtConfig from '../config/jwt.config.json';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConfig.JWT_SECRET,
      signOptions: { expiresIn: jwtConfig.JWT_EXPIRE_IN },
    }),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

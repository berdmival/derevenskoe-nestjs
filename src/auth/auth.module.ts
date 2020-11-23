import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { AuthResolver } from './auth.resolver';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [UserModule, JwtModule.register({})],
  providers: [AuthService, TokenService, AuthResolver, UserService],
  exports: [AuthService, TokenService, UserService],
})
export class AuthModule {}

import { Req, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { GetCredentials } from './decorators/credentials.decorator';
import { AuthData } from '../interfaces';
import { JwtAuthGuard } from './guards/jwt.guard';
import { PasswordAuthGuard } from './guards/password.guard';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(returns => Boolean)
  @UseGuards(PasswordAuthGuard)
  async login(@GetCredentials() credentials: AuthData) {
    return !!credentials;
  }

  @Mutation(returns => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@Args('all') all: boolean, @Req() req: Request) {
    const { userUID } = this.authService.getCredentialsFromRequest(req);
    if (!all && !userUID) {
      return false;
    } else {
      return this.authService.logout({ all, userUID });
    }
  }
}

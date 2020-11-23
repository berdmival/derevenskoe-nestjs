import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { GetCredentials } from 'src/decorators/credentials.decorator';
import { AuthData } from '../interfaces';
import { PasswordAuthGuard } from './guards/password.guard';

@Resolver()
export class AuthResolver {
  @Mutation(returns => Boolean)
  @UseGuards(PasswordAuthGuard)
  async login(@GetCredentials() credentials: AuthData) {
    return !!credentials.userId;
  }
}

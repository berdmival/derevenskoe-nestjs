import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInput } from './models/user.input';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => [User])
  async users() {
    return await this.userService.findAll();
  }

  @Mutation(returns => User)
  async registerUser(@Args('user') user: UserInput) {
    return await this.userService.create(user);
  }
}

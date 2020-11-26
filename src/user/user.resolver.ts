import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInput } from './models/user.input';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => [User])
  async users() {
    return await this.userService.findAll();
  }

  @Query(returns => User)
  async user(@Args('id', { type: () => ID }) id: number) {
    return await this.userService.findById(id);
  }

  @Mutation(returns => User)
  async registerUser(@Args('user') user: UserInput) {
    return await this.userService.create(user);
  }

  @Mutation(returns => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: number,
    @Args('user') user: UserInput,
  ) {
    return await this.userService.update(id, user);
  }

  @Mutation(returns => User)
  async removeUser(@Args('id', { type: () => ID }) id: number) {
    return await this.userService.remove(id);
  }

  // @Mutation(returns => User)
  // async createRole(@Args('id', { type: () => ID }) id: number) {
  //   return await this.userService.remove(id);
  // }

  // @Mutation(returns => User)
  // async addRoleToUser(@Args('id', { type: () => ID }) id: number) {
  //   return await this.userService.remove(id);
  // }

  @Mutation(returns => User)
  async addUserImage(
    @Args('id', { type: () => ID }) id: number,
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
  ) {
    return await this.userService.addImage(id, image);
  }

  @Mutation(returns => User)
  async deleteUserImage(@Args('id', { type: () => ID }) id: number) {
    return await this.userService.deleteImage(id);
  }
}

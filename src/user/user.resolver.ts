import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UserInput} from './models/user.input';
import {User} from './models/user.model';
import {UserService} from './user.service';
import {FileUpload, GraphQLUpload} from 'graphql-upload';
import {AdminAccess, LoggedInAccess} from "../auth/decorators/roles.decorator";

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {
    }

    @Query(returns => [User])
    @AdminAccess()
    async users() {
        return await this.userService.findAll();
    }

    @Query(returns => User)
    @LoggedInAccess()
    async user(@Args('id', {type: () => ID}) id: number) {
        return await this.userService.findById(id);
    }

    @Mutation(returns => User)
    async registerUser(@Args('user') user: UserInput) {
        return await this.userService.create(user);
    }

    @Mutation(returns => User)
    @LoggedInAccess()
    async updateUser(
        @Args('id', {type: () => ID}) id: number,
        @Args('user') user: UserInput,
    ) {
        return await this.userService.update(id, user);
    }

    @Mutation(returns => User)
    @LoggedInAccess()
    async removeUser(@Args('id', {type: () => ID}) id: number) {
        return await this.userService.remove(id);
    }

    @Mutation(returns => User)
    @AdminAccess()
    async assignAdminRole(@Args('id', {type: () => ID}) id: number) {
        return await this.userService.assignAdminRole(id);
    }

    @Mutation(returns => User)
    @AdminAccess()
    async revokeAdminRole(@Args('id', {type: () => ID}) id: number) {
        return await this.userService.revokeAdminRole(id);
    }

    @Mutation(returns => User)
    @LoggedInAccess()
    async addUserImage(
        @Args('id', {type: () => ID}) id: number,
        @Args('image', {type: () => GraphQLUpload}) image: FileUpload,
    ) {
        return await this.userService.addImage(id, image);
    }

    @Mutation(returns => User)
    @LoggedInAccess()
    async deleteUserImage(@Args('id', {type: () => ID}) id: number) {
        return await this.userService.deleteImage(id);
    }
}

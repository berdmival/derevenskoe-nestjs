import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import {OrderService} from './order.service';
import {Order} from './models/order.model';
import {OrderInput} from './models/order.input';
import {ProductService} from '../product/product.service';
import {UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/guards/jwt.guard';
import {GetUserPayload} from '../auth/decorators/user.decorator';
import {UserService} from '../user/user.service';
import {Address} from './models/address.model';
import {OrderProductServingEntity} from "./entities/orderProductServing.entity";

@Resolver(of => Order)
export class OrderResolver {
    constructor(
        private readonly orderService: OrderService,
        private readonly productService: ProductService,
        private readonly userService: UserService,
    ) {
    }

    @Query(returns => [Order])
    async orders() {
        return await this.orderService.findAll();
    }

    @Query(returns => Order)
    async order(@Args('id', {type: () => ID}) id: number) {
        return await this.orderService.findById(id);
    }

    @Mutation(returns => Order)
    @UseGuards(JwtAuthGuard)
    async createOrder(
        @Args('order') order: OrderInput,
        @GetUserPayload('userId') userId: number,
    ) {
        const processedOrdersProductsServings = []; // TODO: make an interface for typing this

        for (const serving of order.servings) {
            const newServing = await this.orderService.createProductServing(serving);
            processedOrdersProductsServings.push(newServing);
        }

        const user = await this.userService.findById(userId);

        return await this.orderService.create({
            ...order,
            servings: processedOrdersProductsServings,
            user,
        });
    }

    @Mutation(returns => Order)
    async deleteOrder(@Args('id', {type: () => ID}) id: number) {
        return await this.orderService.remove(id);
    }

    @Query(returns => [Address])
    async geoDecoder(@Args('rawAddress') rawAddress: string) {
        return await this.orderService.makeFormattedAddresses(rawAddress);
    }
}

import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './models/order.model';
import { OrderInput } from './models/order.input';

@Resolver(of => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(returns => [Order])
  async orders() {
    return await this.orderService.findAll();
  }

  @Query(returns => Order)
  async order(@Args('id', { type: () => ID }) id: number) {
    return await this.orderService.findById(id);
  }

  @Mutation(returns => Order)
  async createOrder(@Args('order') order: OrderInput) {
    return await this.orderService.create(order);
  }

  @Mutation(returns => Order)
  async deleteOrder(@Args('id', { type: () => ID }) id: number) {
    return await this.orderService.remove(id);
  }
}

import {Module} from '@nestjs/common';
import {OrderService} from './order.service';
import {OrderResolver} from './order.resolver';
import {UserService} from '../user/user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {OrderEntity} from './entities/order.entity';
import {AddressEntity} from './entities/address.entity';
import {UserEntity} from '../user/entities/user.entity';
import {UserModule} from '../user/user.module';
import {AuthModule} from '../auth/auth.module';
import {ProductModule} from '../product/product.module';
import {ProductService} from '../product/product.service';
import {ProductEntity} from '../product/entities/product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity,
            AddressEntity,
            UserEntity,
            ProductEntity,
        ]),
        UserModule,
        AuthModule,
        ProductModule,
    ],
    providers: [OrderService, OrderResolver, UserService, ProductService],
})
export class OrderModule {
}

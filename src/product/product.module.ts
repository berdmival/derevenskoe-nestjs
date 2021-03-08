import {Module} from '@nestjs/common';
import {ProductService} from './product.service';
import {ProductResolver} from './product.resolver';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductEntity} from './entities/product.entity';
import {ImageService} from 'src/image/image.service';
import {CategoryService} from "../category/category.service";
import {CategoryModule} from "../category/category.module";
import {CategoryEntity} from "../category/entities/category.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity]), CategoryModule, AuthModule],
    providers: [ProductService, ProductResolver, ImageService, CategoryService],
})
export class ProductModule {
}

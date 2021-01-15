import {Module} from '@nestjs/common';
import {ProductService} from './product.service';
import {ProductResolver} from './product.resolver';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductEntity} from './entities/product.entity';
import {ImageService} from 'src/image/image.service';
import {CategoryService} from "../category/category.service";
import {CategoryModule} from "../category/category.module";
import {CategoryEntity} from "../category/entities/category.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity]), CategoryModule],
    providers: [ProductService, ProductResolver, ImageService, CategoryService],
})
export class ProductModule {
}

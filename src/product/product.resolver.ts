import {Args, ID, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Product} from './models/product.model';
import {ProductInput} from './models/product.input';
import {ProductService} from './product.service';
import {FileUpload, GraphQLUpload} from 'graphql-upload';
import {CategoryService} from "../category/category.service";
import {ProductEntity} from "./entities/product.entity";
import {DeepPartial} from "typeorm";
import {AdminAccess} from "../auth/decorators/roles.decorator";

@Resolver(of => Product)
export class ProductResolver {
    constructor(
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService
    ) {
    }

    @Query(returns => Product)
    async product(@Args('id', {type: () => ID}) id: number) {
        return await this.productService.findById(id);
    }

    @Query(returns => [Product])
    async products(
        @Args('skip', {type: () => Int, defaultValue: 0}) skip: number,
        @Args('limit', {type: () => Int, defaultValue: 0}) limit: number
    ) {
        return await this.productService.findAll(skip, limit);
    }

    @Query(returns => [Product])
    async productsByCategory(
        @Args('categoryId', {type: () => ID}) categoryId: number,
        @Args('skip', {type: () => Int, defaultValue: 0}) skip: number,
        @Args('limit', {type: () => Int, defaultValue: 0}) limit: number
    ) {
        return await this.productService.getProductsByCategory(categoryId, skip, limit);
    }

    @Mutation(returns => Product)
    @AdminAccess()
    async addProduct(
        @Args('product') product: ProductInput,
        @Args('categoryId', {type: () => ID, nullable: true}) categoryId?: number
    ) {
        if (categoryId) {
            const productCategory = await this.categoryService.findById(categoryId);
            const newProduct: DeepPartial<ProductEntity> = {...product, category: productCategory};
            return await this.productService.create(newProduct);
        }
        return await this.productService.create(product);
    }

    @Mutation(returns => Product)
    @AdminAccess()
    async updateProduct(
        @Args('id', {type: () => ID}) id: number,
        @Args('product') product: ProductInput,
        @Args('categoryId', {type: () => ID, nullable: true}) categoryId?: number
    ) {
        if (categoryId) {
            const productCategory = await this.categoryService.findById(categoryId);
            const newProduct: DeepPartial<ProductEntity> = {...product, category: productCategory};
            return await this.productService.update(id, newProduct);
        }
        return await this.productService.update(id, product);
    }

    @Mutation(returns => Product)
    @AdminAccess()
    async removeProduct(@Args('id', {type: () => ID}) id: number) {
        return await this.productService.remove(id);
    }

    @Mutation(returns => Product)
    @AdminAccess()
    async addProductImages(
        @Args('id', {type: () => ID}) id: number,
        @Args('images', {type: () => [GraphQLUpload]}) images: FileUpload[],
    ) {
        return await this.productService.addImages(id, images);
    }

    @Mutation(returns => Product)
    @AdminAccess()
    async deleteProductImage(
        @Args('id', {type: () => ID}) id: number,
        @Args('imageName') imageName: string,
    ) {
        return await this.productService.deleteImage(id, imageName);
    }
}

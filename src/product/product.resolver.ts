import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Product} from './models/product.model';
import {ProductInput} from './models/product.input';
import {ProductService} from './product.service';
import {FileUpload, GraphQLUpload} from 'graphql-upload';

@Resolver(of => Product)
export class ProductResolver {
    constructor(private readonly productService: ProductService) {
    }

    @Query(returns => Product)
    async product(@Args('id', {type: () => ID}) id: number) {
        return await this.productService.findById(id);
    }

    @Query(returns => [Product])
    async products() {
        return await this.productService.findAll();
    }

    @Mutation(returns => Product)
    async addProduct(@Args('product') product: ProductInput) {
        return await this.productService.create(product);
    }

    @Mutation(returns => Product)
    async updateProduct(
        @Args('id', {type: () => ID}) id: number,
        @Args('product') product: ProductInput,
    ) {
        return await this.productService.update(id, product);
    }

    @Mutation(returns => Product)
    async removeProduct(@Args('id', {type: () => ID}) id: number) {
        return await this.productService.remove(id);
    }

    @Mutation(returns => Product)
    async addProductImages(
        @Args('id', {type: () => ID}) id: number,
        @Args('images', {type: () => [GraphQLUpload]}) images: FileUpload[],
    ) {
        return await this.productService.addImages(id, images);
    }

    @Mutation(returns => Product)
    async deleteProductImage(
        @Args('id', {type: () => ID}) id: number,
        @Args('imageName') imageName: string,
    ) {
        return await this.productService.deleteImage(id, imageName);
    }
}

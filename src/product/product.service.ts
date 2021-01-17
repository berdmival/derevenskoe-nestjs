import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CommonCrudService} from '../common/commonCrud.service';
import {Repository} from 'typeorm';
import {ProductEntity} from './entities/product.entity';
import {ImageService} from 'src/image/image.service';
import {FileUpload} from 'graphql-upload';
import {CategoryEntity} from "../category/entities/category.entity";

@Injectable()
export class ProductService extends CommonCrudService<ProductEntity> {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
        private readonly imageService: ImageService,
    ) {
        super(productRepository);
    }

    // TODO: pagination in the findAll and getProductsByCategory methods

    async findAll() {
        return super.findAll();
    }

    async getProductsByCategory(categoryId: number) {
        const category = await this.categoryRepository.findOne({id: categoryId}, {relations: ['products']});
        return category ? category.products : [];
    }

    async remove(id: number) {
        const removedProduct = await super.remove(id);
        if (
            removedProduct.picturesNames &&
            removedProduct.picturesNames.length > 0
        ) {
            removedProduct.picturesNames.forEach(pictureName => {
                this.imageService.deleteImageFile('product', id, pictureName);
            });
        }
        return removedProduct;
    }

    async addImages(id: number, images: FileUpload[]) {
        const product = await this.productRepository.findOneOrFail(id);
        product.picturesNames = await this.imageService.saveSomeImages(
            images,
            product.picturesNames || [],
            id,
            'product',
        );
        return await this.productRepository.save(product);
    }

    async deleteImage(id: number, imageName: string) {
        const product = await this.productRepository.findOneOrFail(id);
        this.imageService.deleteImageFile('product', id, imageName);
        product.picturesNames.splice(product.picturesNames.indexOf(imageName), 1);
        return await this.productRepository.save(product);
    }
}

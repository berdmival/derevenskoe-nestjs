import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CommonCrudService} from '../common/commonCrud.service';
import {Repository} from 'typeorm';
import {ProductEntity} from './entities/product.entity';
import {ImageService} from 'src/image/image.service';
import {FileUpload} from 'graphql-upload';

@Injectable()
export class ProductService extends CommonCrudService<ProductEntity> {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly imageService: ImageService,
    ) {
        super(productRepository);
    }

    // TODO: ordering and filtering in the findAll and getProductsByCategory methods

    async findAll(skip: number = 0, limit: number = 0) {
        return await this.productRepository.createQueryBuilder("product")
            .select()
            .skip(skip)
            .take(limit)
            .leftJoinAndSelect("product.category", "category")
            .getMany()
    }

    async getProductsByCategory(categoryId: number, skip: number = 0, limit: number = 0) {
        return await this.productRepository.createQueryBuilder("product")
            .innerJoinAndSelect("product.category", "category", "category.id = :categoryId", { categoryId })
            .skip(skip)
            .take(limit)
            .getMany()
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

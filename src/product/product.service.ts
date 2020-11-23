import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCrudService } from '../common/commonCrud.service';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ImageService } from 'src/image/image.service';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class ProductService extends CommonCrudService<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private imageService: ImageService,
  ) {
    super(productRepository);
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
    const imagesNames = await this.imageService.saveSomeImages(
      images,
      product.picturesNames || [],
      id,
      'product',
    );
    product.picturesNames = imagesNames;
    return await this.productRepository.save(product);
  }

  async deleteImage(id: number, imageName: string) {
    const product = await this.productRepository.findOneOrFail(id);
    this.imageService.deleteImageFile('product', id, imageName);
    product.picturesNames.splice(product.picturesNames.indexOf(imageName), 1);
    return await this.productRepository.save(product);
  }
}

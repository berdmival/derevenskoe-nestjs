import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductInput } from './models/productInput.input';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  findById(id: number): Promise<ProductEntity> {
    return this.productRepository.findOneOrFail(id);
  }

  create(product: ProductInput) {
    return this.productRepository.save(product);
  }

  async update(id: number, product: ProductInput) {
    const oldProduct = await this.productRepository.findOneOrFail(id);
    return this.productRepository.save({ ...oldProduct, ...product });
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneOrFail(id);
    return this.productRepository.remove(product);
  }
}

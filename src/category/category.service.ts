import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCrudService } from '../common/commonCrud.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { FileUpload } from 'graphql-upload';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class CategoryService extends CommonCrudService<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private imageService: ImageService,
  ) {
    super(categoryRepository);
  }

  async remove(id: number) {
    const removedCategory = await super.remove(id);
    if (removedCategory.pictureName) {
      this.imageService.deleteImageFile(
        'category',
        id,
        removedCategory.pictureName,
      );
    }
    return removedCategory;
  }

  async addImage(id: number, image: FileUpload) {
    const category = await this.categoryRepository.findOneOrFail(id);
    category.pictureName = await this.imageService.saveUploadedFile(
      image,
      id,
      'category',
    );
    return await this.categoryRepository.save(category);
  }

  async deleteImage(id: number) {
    const category = await this.categoryRepository.findOneOrFail(id);
    const imageName = category.pictureName;
    this.imageService.deleteImageFile('category', id, imageName);
    category.pictureName = null;
    return await this.categoryRepository.save(category);
  }
}

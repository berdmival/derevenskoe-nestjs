import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCrudService } from 'src/common/commonCrud.service';
import { Repository } from 'typeorm';
import CategoryEntity from './entities/category.entity';

@Injectable()
export class CategoryService extends CommonCrudService<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {
    super(categoryRepository);
  }
}

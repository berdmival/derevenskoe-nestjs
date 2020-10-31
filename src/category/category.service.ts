import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import CategoryEntity from './entities/category.entity';

@Injectable()
export class CategoryService extends CommonService<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {
    super(categoryRepository);
  }
}

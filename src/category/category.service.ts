import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CommonCrudService} from '../common/commonCrud.service';
import {Connection, DeepPartial, Repository} from 'typeorm';
import {CategoryEntity} from './entities/category.entity';
import {FileUpload} from 'graphql-upload';
import {ImageService} from 'src/image/image.service';

@Injectable()
export class CategoryService extends CommonCrudService<CategoryEntity> {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
        private connection: Connection,
        private readonly imageService: ImageService,
    ) {
        super(categoryRepository);
    }

    async findAll() {
        return await this.categoryRepository.createQueryBuilder("category")
            .select()
            .leftJoinAndSelect("category.parentCategory", "parent")
            .leftJoinAndSelect("category.childCategories", "child")
            .getMany()
    }

    async createWithParent(category: DeepPartial<CategoryEntity>, parentId: number) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let categoryWithParent;

        try {
            const newCategory = await queryRunner.manager
                .save(CategoryEntity, category);

            await queryRunner.manager
                .createQueryBuilder(CategoryEntity, "category")
                .relation(CategoryEntity, "parentCategory")
                .of(newCategory.id)
                .set(parentId)

            categoryWithParent = await queryRunner.manager
                .findOneOrFail(CategoryEntity, newCategory.id)

            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }

        return categoryWithParent
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

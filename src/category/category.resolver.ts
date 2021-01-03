import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryInput } from './models/category.input';
import { Category } from './models/category.model';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver(of => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(returns => [Category])
  async categories() {
    return await this.categoryService.findAll();
  }

  @Query(returns => Category)
  async category(@Args('id', { type: () => ID }) id: number) {
    return await this.categoryService.findById(id);
  }

  @Mutation(returns => Category)
  async addCategory(@Args('category') category: CategoryInput) {
    return await this.categoryService.create(category);
  }

  @Mutation(returns => Category)
  async updateCategory(
    @Args('id', { type: () => ID }) id: number,
    @Args('category') category: CategoryInput,
  ) {
    return await this.categoryService.update(id, category);
  }

  @Mutation(returns => Category)
  async removeCategory(@Args('id', { type: () => ID }) id: number) {
    return await this.categoryService.remove(id);
  }

  @Mutation(returns => Category)
  async addCategoryImage(
    @Args('id', { type: () => ID }) id: number,
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
  ) {
    return await this.categoryService.addImage(id, image);
  }

  @Mutation(returns => Category)
  async deleteCategoryImage(@Args('id', { type: () => ID }) id: number) {
    return await this.categoryService.deleteImage(id);
  }
}

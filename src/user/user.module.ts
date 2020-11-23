import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { ImageService } from '../image/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  providers: [UserService, UserResolver, ImageService],
  exports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]), ImageService],
})
export class UserModule {}

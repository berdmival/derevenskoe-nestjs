import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCrudService } from 'src/common/commonCrud.service';
import { ImageService } from 'src/image/image.service';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { FileUpload } from 'graphql-upload';
import { RoleEntity } from './entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { UserInput } from './models/user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends CommonCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private imageService: ImageService,
    private configService: ConfigService,
  ) {
    super(userRepository);
  }

  async findOne(login: string) {
    return await this.userRepository.findOneOrFail({ phone: login });
  }

  async create(user: UserInput) {
    let userRole: RoleEntity;
    try {
      userRole = await this.roleRepository.findOneOrFail({
        name: this.configService.get<string>('security.roles.user'),
      });
    } catch (err) {
      userRole = await this.roleRepository.save({
        name: this.configService.get<string>('security.roles.user'),
      });
    }

    if (!user.name) {
      user.name = `user${Date.now()}`;
    }

    if (!user.roles) {
      user.roles = [];
    }

    user.roles.push(userRole);

    const salt = parseInt(<string>process.env.USER_SALT);
    user.password = await bcrypt.hash(user.password, salt);

    return super.create(user);
  }

  async remove(id: number) {
    const removedUser = await super.remove(id);
    if (removedUser.pictureName) {
      this.imageService.deleteImageFile('user', id, removedUser.pictureName);
    }
    return removedUser;
  }

  async addImage(id: number, image: FileUpload) {
    const user = await this.userRepository.findOneOrFail(id);
    const imageName = await this.imageService.saveUploadedFile(
      image,
      id,
      'user',
    );
    user.pictureName = imageName;
    return await this.userRepository.save(user);
  }

  async deleteImage(id: number) {
    const user = await this.userRepository.findOneOrFail(id);
    const imageName = user.pictureName;
    this.imageService.deleteImageFile('user', id, imageName);
    user.pictureName = null;
    return await this.userRepository.save(user);
  }
}

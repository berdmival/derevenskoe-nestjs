import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService extends CommonCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private imageService: ImageService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super(userRepository);
  }

  async findOne(login: string) {
    return await this.userRepository.findOneOrFail({ phone: login });
  }

  async create(user: UserInput) {
    const userRole: RoleEntity = await this.findOrCreateRole(
      this.configService.get<string>('security.roles.user'),
    );

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

  async assignAdminRole(id: number) {
    const user = await this.userRepository.findOneOrFail(id);
    const adminRole: RoleEntity = await this.findOrCreateRole(
      this.configService.get<string>('security.roles.admin'),
    );

    if (!user.roles) {
      user.roles = [];
    }

    user.roles.push(adminRole);

    await this.authService.logout({ all: true, userId: user.id });

    return await this.userRepository.save(user);
  }

  async revokeAdminRole(id: number) {
    const user = await this.userRepository.findOneOrFail(id);
    const adminRole: RoleEntity = await this.findOrCreateRole(
      this.configService.get<string>('security.roles.admin'),
    );

    if (!user.roles) {
      return user;
    }

    user.roles = user.roles.filter(role => role.id === adminRole.id);

    await this.authService.logout({ all: true, userId: user.id });

    return await this.userRepository.save(user);
  }

  private async findOrCreateRole(roleName: string) {
    let role: RoleEntity;

    role = await this.roleRepository.findOne({
      name: roleName,
    });

    if (!role) {
      role = await this.roleRepository.save({
        name: roleName,
      });
    }

    return role;
  }
}

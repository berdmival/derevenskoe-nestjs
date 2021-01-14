import {forwardRef, Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserResolver} from './user.resolver';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from './entities/user.entity';
import {RoleEntity} from './entities/role.entity';
import {ImageService} from '../image/image.service';
import {AuthModule} from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, RoleEntity]),
        forwardRef(() => AuthModule),
    ],
    providers: [UserService, UserResolver, ImageService],
    exports: [
        TypeOrmModule.forFeature([UserEntity, RoleEntity]),
        ImageService,
        UserService,
    ],
})
export class UserModule {
}

import {forwardRef, Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {AuthService} from './auth.service';
import {TokenService} from './token.service';
import {AuthResolver} from './auth.resolver';
import {UserModule} from 'src/user/user.module';

@Module({
    imports: [JwtModule.register({}), forwardRef(() => UserModule)],
    providers: [AuthService, TokenService, AuthResolver],
    exports: [AuthService, TokenService],
})
export class AuthModule {
}

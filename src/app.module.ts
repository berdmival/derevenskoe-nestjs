import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ImageModule } from './image/image.module';
import configuration from './configuration/default';

const dbConfiguration = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
  synchronize: true, // TODO: remove this in production
} as TypeOrmModuleOptions;

if (!process.env.LOCAL) dbConfiguration['ssl'] = { rejectUnauthorized: false };

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot({ ...dbConfiguration }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req, res, ...ctx }) => ({ req, res, ...ctx }),
      playground: true,
      introspection: true,
    }),
    ProductModule,
    CategoryModule,
    UserModule,
    AuthModule,
    OrderModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

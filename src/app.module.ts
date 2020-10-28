import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
      synchronize: true, // TODO: remove this in production
    }),
    GraphQLModule.forRoot({ autoSchemaFile: true }),
    ProductModule,
    CategoryModule,
    UserModule,
    AuthModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

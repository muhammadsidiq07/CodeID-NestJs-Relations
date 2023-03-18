import { Module } from '@nestjs/common';
import { ProdukController } from './../produk/produk.controller';
import { ProdukService } from './../produk/produk.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Users } from 'output/entities/Users';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { ProductCategory } from 'output/entities/ProductCategory';
import { Product } from 'output/entities/Product';
import { Orders } from 'output/entities/Orders';
import { OrderDetail } from 'output/entities/OrderDetail';
import { Customer } from 'output/entities/Customer';
import { LocalGuard } from 'src/auth/local.strategy';
import { JwtGuard } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      ProductCategory,
      Product,
      Orders,
      OrderDetail,
      Customer,
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [UserService, ProdukService, LocalGuard, JwtGuard],
  controllers: [UserController, ProdukController],
  exports: [UserService],
})
export class ModuleModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'output/entities/Users';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  Salt = 10;

  public async signup(fields: any) {
    try {
      const hashPassword = await Bcrypt.hash(fields.password, this.Salt);
      const user = await this.userRepo.save({
        username: fields.username,
        password: hashPassword,
        createdat: new Date(),
        updatedat: new Date(),
      });
      const { password, ...result } = user;
      return result;
    } catch (error) {
      return error.message;
    }
  }

  public async validateUser(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username: username },
      relations: {
        customers: true,
        orders: {
          orderDetails: {
            product: true,
          },
        },
      },
    });
    const compare = await Bcrypt.compare(password, user.password);

    if (compare) {
      return user;
    }
  }

  public async login(user: any) {
    const payload = {
      username: user.username,
      password: user.password,
      firstname: user.customers.firstname,
      lastname: user.customers.lastname,
      orderDetails: user.orders,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

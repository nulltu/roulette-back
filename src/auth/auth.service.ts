import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ username, email, password }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await hash(password, 10);

    await this.usersService.createUser({
      username,
      email,
      password: hashedPassword,
    });

    return {
      message: 'Successfully registered',
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    user.lastLogin = new Date();
    await this.usersService.update(user.id, { lastLogin: user.lastLogin });
    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token: token,
      email: user.email,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: number, data: Partial<User>): Promise<void> {
    await this.userRepository.update(id, data);
  }
}

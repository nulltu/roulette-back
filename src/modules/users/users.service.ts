import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import LOGGER from '../../config/logger';
import { HTTP_STATUS_MESSAGES } from '../../shared/utils/constants';
import { mapUserToDto } from '../../shared/utils/transform-dtos';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: Partial<User>): Promise<User> {
    try {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      LOGGER.error(
        `${HTTP_STATUS_MESSAGES.ERROR_WHILE_CREATING_USER} ${error.message}`,
      );
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    try {
      const users = await this.userRepository.find();
      if (!users) {
        throw new NotFoundException('No users found');
      }
      return users.map((user) => mapUserToDto(user));
    } catch (error) {
      LOGGER.error(HTTP_STATUS_MESSAGES.FAILED_FETCHING_USERS, error);
      throw error;
    }
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findOneById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userResponseDto: UserResponseDto = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return userResponseDto;
  }

  async deleteById(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(HTTP_STATUS_MESSAGES.USER_NOT_FOUND);
      }

      await this.userRepository.remove(user);

      return {
        message: HTTP_STATUS_MESSAGES.USER_DELETED_SUCCESS,
      };
    } catch (error) {
      LOGGER.error(`Failed to delete user with ID ${id}`, error);
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException(
            HTTP_STATUS_MESSAGES.FAILED_DELETED_USER,
          );
    }
  }

  async update(id: number, data: Partial<User>): Promise<void> {
    await this.userRepository.update(id, data);
  }
}

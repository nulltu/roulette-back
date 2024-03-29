import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { HTTP_STATUS_MESSAGES } from '../../shared/utils/constants';
import LOGGER from '../../config/logger';
import { mapPlayerToDto } from '../../shared/utils/transform-dtos';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    const { name } = createPlayerDto;

    const existingPlayer = await this.playersRepository.findOne({
      where: { name },
    });
    if (existingPlayer) {
      throw new ConflictException('name already exists');
    }

    const player = this.playersRepository.create(createPlayerDto);
    return this.playersRepository.save(player);
  }

  async findAll() {
    try {
      const player = await this.playersRepository.find();
      if (!player || player.length === 0) {
        throw new NotFoundException('No players found');
      }
      return player.map((user) => mapPlayerToDto(user));
    } catch (error) {
      LOGGER.error(HTTP_STATUS_MESSAGES.FAILED_FETCHING_GROUPS, error);
      throw error;
    }
  }

  async deletePlayerById(id: number) {
    try {
      const player = await this.playersRepository.findOneBy({ id });

      if (!player) {
        throw new NotFoundException(HTTP_STATUS_MESSAGES.PLAYER_NOT_FOUND);
      }

      await this.playersRepository.remove(player);

      return {
        message: HTTP_STATUS_MESSAGES.PLAYER_DELETED_SUCCESS,
      };
    } catch (error) {
      LOGGER.error(`Failed to delete user with ID ${id}`, error);
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException(
            HTTP_STATUS_MESSAGES.FAILED_DELETED_PLAYER,
          );
    }
  }
}

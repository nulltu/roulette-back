import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { ResponseCreateGroupDto } from './dto/response-create-group.dto';
import { mapGroupToDto } from '../../shared/utils/transform-dtos';
import { HTTP_STATUS_MESSAGES } from '../../shared/utils/constants';
import LOGGER from '../../config/logger';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupsRepository: Repository<Group>,
  ) {}

  async create(
    createGroupDto: CreateGroupDto,
  ): Promise<ResponseCreateGroupDto> {
    const group = this.groupsRepository.create(createGroupDto);
    const savedGroup = await this.groupsRepository.save(group);
    return {
      id: savedGroup.id,
      groupName: savedGroup.groupName,
      userId: savedGroup.userId,
    };
  }

  async findAll(): Promise<ResponseCreateGroupDto[]> {
    try {
      const group = await this.groupsRepository.find();
      if (!group || group.length === 0) {
        throw new NotFoundException('No groups found');
      }
      return group.map((user) => mapGroupToDto(user));
    } catch (error) {
      LOGGER.error(HTTP_STATUS_MESSAGES.FAILED_FETCHING_GROUPS, error);
      throw error;
    }
  }

  async findGroupById(id: number) {
    const group = await this.groupsRepository.findOneBy({ id });
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const responseCreateGroupDto: ResponseCreateGroupDto = {
      id: group.id,
      groupName: group.groupName,
      userId: group.userId,
    };

    return responseCreateGroupDto;
  }

  async deleteGroupById(id: number) {
    try {
      const group = await this.groupsRepository.findOneBy({ id });

      if (!group) {
        throw new NotFoundException(HTTP_STATUS_MESSAGES.GROUP_NOT_FOUND);
      }

      await this.groupsRepository.remove(group);

      return {
        message: HTTP_STATUS_MESSAGES.GROUP_DELETED_SUCCESS,
      };
    } catch (error) {
      LOGGER.error(`Failed to delete user with ID ${id}`, error);
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException(
            HTTP_STATUS_MESSAGES.FAILED_DELETED_GROUP,
          );
    }
  }
}

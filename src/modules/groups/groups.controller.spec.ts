import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { ResponseCreateGroupDto } from './dto/response-create-group.dto';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';

const mockRepository = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  deleteById: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

describe('GroupsController', () => {
  let controller: GroupsController;
  let groupsService: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    groupsService = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const createGroupDto: CreateGroupDto = {
        groupName: 'Test Group',
        userId: 1,
      };
      const response: ResponseCreateGroupDto = {
        id: 1,
        groupName: 'Test Group',
        userId: 1,
      };
      jest.spyOn(groupsService, 'create').mockResolvedValue(response);

      expect(await controller.create(createGroupDto)).toEqual(response);
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      const response: ResponseCreateGroupDto[] = [
        { id: 1, groupName: 'Test Group', userId: 1 },
      ];
      jest.spyOn(groupsService, 'findAll').mockResolvedValue(response);

      expect(await controller.findAll()).toEqual(response);
    });
  });

  describe('findGroupById', () => {
    it('should return a group by id', async () => {
      const id = 1;
      const response: ResponseCreateGroupDto = {
        id: 1,
        groupName: 'Test Group',
        userId: 1,
      };
      jest.spyOn(groupsService, 'findGroupById').mockResolvedValue(response);

      expect(await controller.findGroupById(id)).toEqual(response);
    });

    it('should throw NotFoundException if group not found', async () => {
      const id = 1;
      jest
        .spyOn(groupsService, 'findGroupById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.findGroupById(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteGroupById', () => {
    it('should delete a group by id', async () => {
      const id = 1;
      const response = { message: 'Group deleted successfully' };
      jest.spyOn(groupsService, 'deleteGroupById').mockResolvedValue(response);

      expect(await controller.deleteGroupById(id)).toEqual(response);
    });

    it('should throw NotFoundException if group not found', async () => {
      const id = 1;
      jest
        .spyOn(groupsService, 'deleteGroupById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.deleteGroupById(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

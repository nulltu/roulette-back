import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Repository } from 'typeorm';
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

describe('GroupsService', () => {
  let groupsService: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Group),
          useValue: mockRepository,
        },
      ],
    }).compile();

    groupsService = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(groupsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const createGroupDto = { groupName: 'Test Group', userId: 1 };
      const savedGroup = { id: 1, ...createGroupDto };
      jest.spyOn(mockRepository, 'create').mockReturnValue(savedGroup as any);
      jest.spyOn(mockRepository, 'save').mockResolvedValue(savedGroup as any);

      const result = await groupsService.create(createGroupDto);

      expect(result).toEqual({
        id: savedGroup.id,
        groupName: savedGroup.groupName,
        userId: savedGroup.userId,
      });
    });
  });

  describe('findAll', () => {
    it('should find all groups', async () => {
      const groups = [{ id: 7, groupName: 'Test Group', userId: 1 }];
      jest.spyOn(mockRepository, 'find').mockResolvedValue(groups as any);

      const result = await groupsService.findAll();

      expect(result).toEqual(groups);
    });

    it('should throw NotFoundException if no groups found', async () => {
      jest.spyOn(mockRepository, 'find').mockResolvedValue([] as any);

      await expect(groupsService.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findGroupById', () => {
    it('should find a group by id', async () => {
      const group = { id: 1, groupName: 'string', userId: 1 };
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(group as any);

      const result = await groupsService.findGroupById(1);

      expect(result).toEqual(group);
    });

    it('should throw NotFoundException if no groups found', async () => {
      jest.spyOn(mockRepository, 'find').mockResolvedValue([] as any);

      await expect(groupsService.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteGroupById', () => {
    it('should delete a group by id', async () => {
      const group = { id: 1, groupName: 'string', userId: 1 };
      jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(group as any);
      jest.spyOn(mockRepository, 'remove').mockResolvedValue({} as any);

      const result = await groupsService.deleteGroupById(1);

      expect(result).toEqual({ message: 'Group deleted successfully' });
    });

    it('should throw NotFoundException if group not found', async () => {
      jest
        .spyOn(mockRepository, 'findOneBy22')
        .mockResolvedValue(undefined as any);

      await expect(groupsService.findGroupById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

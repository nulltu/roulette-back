import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayersService } from './players.service';
import { Player } from './entities/player.entity';

const mockPlayerRepository = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  deleteById: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  existsBy: jest.fn(),
};

describe('PlayersService', () => {
  let playerService: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Player),
          useValue: mockPlayerRepository,
        },
      ],
    }).compile();

    playerService = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(playerService).toBeDefined();
  });

  describe('create', () => {
    it('should create a player', async () => {
      const createPlayerDto = { name: 'Test Player', groupId: undefined };

      const player = new Player();
      player.name = 'Test Player';

      jest.spyOn(mockPlayerRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(mockPlayerRepository, 'create').mockReturnValue(player);
      jest.spyOn(mockPlayerRepository, 'save').mockResolvedValue(player);
      jest.spyOn(mockPlayerRepository, 'existsBy').mockResolvedValue(true);

      const result = await playerService.create(createPlayerDto);

      expect(mockPlayerRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Test Player' },
      });
      expect(mockPlayerRepository.create).toHaveBeenCalledWith(createPlayerDto);
      expect(mockPlayerRepository.save).toHaveBeenCalledWith(player);
      expect(mockPlayerRepository.existsBy).toHaveBeenCalledWith({
        userId: createPlayerDto.groupId,
      });

      expect(result).toEqual(player);
    });

    it('should throw ConflictException if player already exists', async () => {
      const createPlayerDto = { name: 'Test Player', groupId: undefined };

      const existingPlayer = new Player();
      existingPlayer.name = 'Existing Player';

      jest
        .spyOn(mockPlayerRepository, 'findOne')
        .mockResolvedValue(existingPlayer);

      await expect(playerService.create(createPlayerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of players', async () => {
      const players = [new Player(), new Player()];
      jest.spyOn(mockPlayerRepository, 'find').mockResolvedValue(players);

      const result = await playerService.findAll();

      expect(mockPlayerRepository.find).toHaveBeenCalled();
      expect(result).toEqual(players);
    });

    it('should throw NotFoundException if no players found', async () => {
      jest.spyOn(mockPlayerRepository, 'find').mockResolvedValue([]);

      await expect(playerService.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePlayerById', () => {
    it('should delete player by id', async () => {
      const playerId = 1;
      const player = new Player();
      player.id = playerId;

      jest.spyOn(mockPlayerRepository, 'findOneBy').mockResolvedValue(player);
      jest.spyOn(mockPlayerRepository, 'remove').mockResolvedValue(undefined);

      const result = await playerService.deletePlayerById(playerId);

      expect(mockPlayerRepository.findOneBy).toHaveBeenCalledWith({
        id: playerId,
      });
      expect(mockPlayerRepository.remove).toHaveBeenCalledWith(player);
      expect(result).toEqual({ message: 'Player deleted successfully' });
    });

    it('should throw NotFoundException if player not found', async () => {
      const playerId = 1;
      jest.spyOn(mockPlayerRepository, 'findOneBy').mockResolvedValue(null);

      await expect(playerService.deletePlayerById(playerId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

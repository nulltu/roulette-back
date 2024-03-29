import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { NotFoundException } from '@nestjs/common';
import { Player } from './entities/player.entity';
import { ResponsePlayerDto } from './dto/response-player.dto';

describe('PlayersController', () => {
  let controller: PlayersController;
  let playersService: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            deletePlayerById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    playersService = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a player', async () => {
      const createPlayerDto: CreatePlayerDto = {
        name: 'Test Player',
        groupId: undefined,
      };
      const createdPlayer = new Player();
      createdPlayer.id = 1;
      createdPlayer.name = 'Test Player';

      jest.spyOn(playersService, 'create').mockResolvedValue(createdPlayer);

      expect(await controller.create(createPlayerDto)).toBe(createdPlayer);
      expect(playersService.create).toHaveBeenCalledWith(createPlayerDto);
    });
  });

  describe('findAll', () => {
    it('should return all players', async () => {
      const players: ResponsePlayerDto[] = [
        { id: 1, name: 'Player 1', groupId: 1 },
        { id: 2, name: 'Player 2', groupId: 2 },
      ];

      jest.spyOn(playersService, 'findAll').mockResolvedValue(players);

      expect(await controller.findAll()).toBe(players);
      expect(playersService.findAll).toHaveBeenCalled();
    });
  });

  describe('deletePlayerById', () => {
    it('should delete a player by id', async () => {
      const playerId = '1';

      jest
        .spyOn(playersService, 'deletePlayerById')
        .mockResolvedValue({ message: 'Player deleted successfully' });

      expect(await controller.deletePlayerById(playerId)).toEqual({
        message: 'Player deleted successfully',
      });
      expect(playersService.deletePlayerById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if player not found', async () => {
      const playerId = '1';

      jest
        .spyOn(playersService, 'deletePlayerById')
        .mockRejectedValue(new NotFoundException('Player not found'));

      await expect(controller.deletePlayerById(playerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(playersService.deletePlayerById).toHaveBeenCalledWith(1);
    });
  });
});

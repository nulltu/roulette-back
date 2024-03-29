import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: 1,
          username: 'John Doe',
          email: 'john@example.com',
          password: 'password',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: new Date(),
          groups: null,
        },
      ];

      jest.spyOn(userService, 'findAll').mockResolvedValue(users);
      expect(await controller.findAll()).toEqual(users);
    });

    it('should call userService.findAll', async () => {
      await controller.findAll();
      expect(userService.findAll).toHaveBeenCalled();
    });
  });
});

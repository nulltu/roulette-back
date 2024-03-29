import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from './users.service';
import { RegisterDto } from '../../auth/dto/register.dto';
import { LoginDto } from '../../auth/dto/login.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

const mockRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  findOneByEmail: jest.fn(),
  deleteById: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UsersService>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            createUser: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      userService.findOneByEmail.mockResolvedValueOnce(null);
      userService.createUser.mockResolvedValueOnce({} as any);

      const result = await authService.register(registerDto);

      expect(result).toEqual({ message: 'Successfully registered' });
    });

    it('should throw BadRequestException if email already exists', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      userService.findOneByEmail.mockResolvedValueOnce({} as any);

      await expect(authService.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should login a user with correct credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        email: 'test@example.com',
        password: 'hashedPassword',
        id: 1,
      } as any;

      userService.findOneByEmail.mockResolvedValueOnce(user);
      userService.update.mockResolvedValueOnce({} as any);
      const signAsyncMock = jest.fn().mockResolvedValue('token');
      jwtService.signAsync = signAsyncMock;

      const result = await authService.login(loginDto);

      expect(result).toEqual({ token: 'token', email: 'test@example.com' });
    });

    it('should throw UnauthorizedException with non-existing email', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      userService.findOneByEmail.mockResolvedValueOnce(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('UsersService', () => {
    let usersService: UsersService;
    let mockUserRepository;

    beforeEach(async () => {
      mockUserRepository = {
        findOneBy: jest.fn(),
        remove: jest.fn(),
      };

      usersService = new UsersService(mockUserRepository);
    });

    describe('deleteById', () => {
      it('should delete user by id', async () => {
        const id = 1;
        const user = { id: 1, username: 'test', email: 'test@example.com' };

        mockUserRepository.findOneBy.mockResolvedValue(user);

        await usersService.deleteById(id);

        expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id });
        expect(mockUserRepository.remove).toHaveBeenCalledWith(user);
      });

      it('should throw NotFoundException if user not found', async () => {
        const id = 1;

        mockUserRepository.findOneBy.mockResolvedValue(null);

        await expect(usersService.deleteById(id)).rejects.toThrow(
          NotFoundException,
        );
      });

      it('should throw InternalServerErrorException on error', async () => {
        const id = 1;
        const error = new Error('Test error');

        mockUserRepository.findOneBy.mockRejectedValue(error);

        await expect(usersService.deleteById(id)).rejects.toThrow(
          InternalServerErrorException,
        );
      });
    });
  });
});

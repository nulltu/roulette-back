import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../modules/users/users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UsersService>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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

      expect(result).toEqual({ message: 'User created successfully' });
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
});

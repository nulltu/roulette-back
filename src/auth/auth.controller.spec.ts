import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with the provided data', async () => {
      const registerDto: RegisterDto = {
        username: 'rusbent',
        email: 'rusbent@rusbent',
        password: 'rusbent',
      };

      await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should call authService.login with the provided data', async () => {
      const loginDto: LoginDto = {
        email: 'rusbent@rusbent',
        password: 'rusbent',
      };

      await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});

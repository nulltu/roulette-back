import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST)', async () => {
    const registerDto = {
      username: 'nulltu',
      email: faker.internet.email(),
      password: 'test123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual({
      message: 'User created successfully',
    });
  });

  it('/auth/login (POST)', async () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'test123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(HttpStatus.OK);

    // Aquí puedes agregar expectativas sobre la respuesta si es necesario
    expect(response.body).toHaveProperty('token');
  });
});

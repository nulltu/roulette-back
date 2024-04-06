import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailServerModule } from '../email-server/email-server.module';
import { EmailService } from '../email-server/email-server.service';
import { CustomLoggerModule } from '../../config/custom-logger/custom-logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailServerModule,
    CustomLoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
  exports: [UsersService],
})
export class UsersModule {}

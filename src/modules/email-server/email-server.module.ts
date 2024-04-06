import { Module } from '@nestjs/common';
import { EmailController } from './email-server.controller';
import { EmailService } from './email-server.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLoggerModule } from '../../config/custom-logger/custom-logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), CustomLoggerModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailServerModule {}

import { Module } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class CustomLoggerModule {}

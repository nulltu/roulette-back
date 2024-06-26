import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../modules/users/entities/user.entity';
import { Group } from '../../modules/groups/entities/group.entity';
import { Player } from '../../modules/players/entities/player.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Group, Player],
        synchronize: true,
        ssl: true,
        uuidExtension: 'pgcrypto',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

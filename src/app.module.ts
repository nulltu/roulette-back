import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { GroupsModule } from './modules/groups/groups.module';
import { PlayersModule } from './modules/players/players.module';
import { EmailServerModule } from './modules/email-server/email-server.module';
import { CustomLoggerModule } from './config/custom-logger/custom-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    GroupsModule,
    PlayersModule,
    EmailServerModule,
    CustomLoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
  constructor() {}
}

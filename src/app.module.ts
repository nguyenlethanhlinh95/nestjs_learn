import { Module, ValidationPipe as NestValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// entity
import { Task } from './tasks/entities/task.entity';
import { User } from './users/entities/user.entity';
// pipe
import { APP_PIPE } from '@nestjs/core';
// controller
import { TasksController } from './tasks/tasks.controller';
import { UsersController } from './users/users.controller';
// service
import { TasksService } from './tasks/tasks.service';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';

@Module({
  // imports: [CustomersModule, TasksModule, UsersModule],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        entities: [Task, User],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Task, User]),
    AuthModule,
  ],
  controllers: [AppController, TasksController, UsersController],
  providers: [
    AppService,
    TasksService,
    UsersService,
    {
      provide: APP_PIPE,
      useClass: NestValidationPipe,
    },
  ],
})
export class AppModule {}

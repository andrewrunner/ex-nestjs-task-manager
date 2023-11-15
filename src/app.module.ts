import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      envFilePath: [ `.env.stage.${process.env.STAGE}`, ], // загрузит соотв. .env файл из корня (параметр указывается в скрипте package.json)
      validationSchema: configValidationSchema // валидаия .env 
     }),
    TasksModule, 

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => { // загрузка из файла (configService доступен благодаря imports и inject)
        
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true, 
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          database: configService.get('DB_DATABASE'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
        }
      }
    }),

    /*
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'task_manager',
      username: 'postgres',
      password: 'postgres',
      autoLoadEntities: true,
      synchronize: true, 
    }), 
    */
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

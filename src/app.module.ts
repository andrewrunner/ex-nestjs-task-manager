import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TasksModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'task_manager',
      username: 'postgres',
      password: 'postgres',
      autoLoadEntities: true,
      synchronize: true, 
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetAuthUser } from 'src/auth/get-auth-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

  private logger = new Logger('TaskController');

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetAuthUser() user: User
  ): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} get all tasks with filter: ${JSON.stringify(filterDto)}`)
    return this.tasksService.getTasks(filterDto, user)
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @GetAuthUser() user: User
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  // @Body('title') title: string,
  // @Body('description') description: string,

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetAuthUser() user: User
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetAuthUser() user: User
  ): Promise<Task> {

    let { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }


  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
    @GetAuthUser() user: User
  ): Promise<void> {
    let count = await this.tasksService.deleteTask(id, user);

    if(!count) {
      throw new NotFoundException(`Task not found!`)
    }

  } 
}

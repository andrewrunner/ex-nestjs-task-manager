import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../src/auth/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {

  private logger = new Logger('TasksService');

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository:TaskRepository,
  ) {}


  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
      return this.taskRepository.getTasks(filterDto, user);
  }



 /* getFilteredTasks(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let filteredTasks = this.getAllTasks();

    if (status) {
      filteredTasks = filteredTasks.filter((item) => item.status === status);
    }

    if (search) {
      filteredTasks = filteredTasks.filter(
        (item) =>
          item.title.includes(search) || item.description.includes(search),
      );
    }

    return filteredTasks;
  }*/

  async getTaskById(id: string, user: User): Promise<Task> {
    //const item = await this.taskRepository.findOne({ where: {id, user } });
    const item = await this.taskRepository.findOne({ where: {id } });

    if (!item) {
      throw new NotFoundException(`Task with ${id} not found!`);
    }

    return item;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
  

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    if (task) task.status = status;
    await this.taskRepository.save(task);

    return task;
  }

  async deleteTask(id: string, user: User): Promise<number> {
    return this.taskRepository.deleteTask(id, user);
  }
}

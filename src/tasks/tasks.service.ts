import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository:TaskRepository,
  ) {}


  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    let query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', {status});
    }

    if (search) {
      query.andWhere('LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)', {
        search: `%${search}%`
      })
    }



    return await this.taskRepository.find();
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

  async getTaskById(id: string): Promise<Task> {
    let item = await this.taskRepository.findOneBy({id: id});

    if (!item) {
      throw new NotFoundException(`Task with ${id} not found!`);
    }

    return item;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
  

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    if (task) task.status = status;
    await this.taskRepository.save(task);

    return task;
  }

  async deleteTask(id: string): Promise<number> {
    return this.taskRepository.deleteTask(id);
  }
}

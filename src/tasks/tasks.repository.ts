import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";

import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";
import { User } from "src/auth/user.entity";
@Injectable()
export class TaskRepository extends Repository<Task> {

    private logger = new Logger('TasksRepository');
    
    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }


    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
    
        let query = this.createQueryBuilder('task');
        
        query.where({ user });
    
        if (status) {
          query.andWhere('task.status = :status', {status});
        }
    
        if (search) {
          query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', {
            search: `%${search}%`
          })
        }
    
        try {
          return await this.find();
        } catch(e) {
          this.logger.error(`Error get taskts by ${user.username}`, e);
          throw new InternalServerErrorException()
        }
      }


    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.create({
          title,
          description,
          status: TaskStatus.OPEN,
        //  user
        });
    
        await this.save(task);
       
        return task;
    }

    async deleteTask(id:string,  user: User) {
      return 1;
        // let deleteResult = await this.delete({id, user});
        // return deleteResult.affected;
    }
}
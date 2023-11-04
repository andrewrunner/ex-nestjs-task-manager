import { Injectable } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@Injectable()
export class TaskRepository extends Repository<Task> {
    
    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.create({
          title,
          description,
          status: TaskStatus.OPEN,
          user
        });
    
        await this.save(task);
       
        return task;
    }

    async deleteTask(id:string,  user: User) {
        let deleteResult = await this.delete({id, user});
        return deleteResult.affected;
    }
}
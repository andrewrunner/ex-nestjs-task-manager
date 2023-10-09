import { Injectable } from "@nestjs/common";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@Injectable()
export class TaskRepository extends Repository<Task> {
    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    async createTask(createTaskDto: CreateTaskDto) {
        const { title, description } = createTaskDto;

        const task = this.create({
          title,
          description,
          status: TaskStatus.OPEN,
        });
    
        await this.save(task);
       
        return task;
    }

    async deleteTask(id:string) {
        let deleteResult = await this.delete(id)
        return deleteResult.affected;
    }
}
import { NotFoundException } from '@nestjs/common';
import {Test} from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

// инициализация объекта репозитория
const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
});

const mockUser = {
    id: '312323',
    username: 'TestUser',
    password: 'qwerty',
    tasks: []
}

describe('TaskService', () => {
    let tasksService:TasksService;
   // let tasksRepository:TaskRepository;
   let tasksRepository;

    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide: TaskRepository, useFactory: mockTasksRepository}
            ],

        }).compile();

        tasksService = module.get(TasksService)
        tasksRepository = module.get(TaskRepository)
    })



    describe('getTasks', () => {
        it('call TasksRepository.getList()', async () => {
            //expect(tasksRepository.getTasks).not.toHaveBeenCalled();

            tasksRepository.getTasks.mockResolvedValue('someValue')
            const result = await tasksService.getTasks(null, mockUser);
            expect(result).toEqual('someValue')
        })
    });


    describe('getTaskById', () => {
        it('call TasksRepository.findOne() and return result', async () => {
           const mockTask = {
               title: 'asdasd',
               descrition: 'adasd',
               id: '123',
               status: TaskStatus.OPEN
           }

           tasksRepository.findOne.mockResolvedValue(mockTask);
           const result = await tasksService.getTaskById('123', mockUser);
           expect(result).toEqual(mockTask)
        });

        it('call TasksRepository.findOne() and handle an error', async () => {
            tasksRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById('123', mockUser)).rejects.toThrow(NotFoundException);
        })
    });

});
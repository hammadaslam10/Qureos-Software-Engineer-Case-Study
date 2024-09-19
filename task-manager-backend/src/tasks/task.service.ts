import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';

@Injectable()
export class TaskService {
    constructor(@InjectModel(Task.name) private readonly taskModel: Model<Task>) { }
    private readonly logger = new Logger(TaskService.name);
    async getTasks(
        page: number = 1,
        limit: number = 10,
        sort: 'asc' | 'desc' = 'asc',
        priority?: string
    ): Promise<{ tasks: Task[], totalPages: number }> {
        const skip = (page - 1) * limit;
        const filter: any = {};

        if (priority) {
            filter.priority = priority;
        }

        const tasks = await this.taskModel.find(filter)
            .sort({ priority: sort === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        const totalTasks = await this.taskModel.countDocuments(filter).exec();
        const totalPages = Math.ceil(totalTasks / limit);

        return { tasks, totalPages };
    }

    async createTask(task: Partial<Task>): Promise<Task> {
        const newTask = new this.taskModel(task);
        return newTask.save();
    }


    async updateTask(id: string, task: Partial<Task>): Promise<Task> {
        return this.taskModel.findByIdAndUpdate(id, task, { new: true }).exec();
    }

    async archiveTask(id: string): Promise<void> {
        await this.taskModel.findByIdAndDelete(id).exec();
    }
}

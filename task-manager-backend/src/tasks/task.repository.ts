import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TaskRepository {
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

    async getAllTasks(page: number, limit: number): Promise<Task[]> {
        return this.taskModel.find().skip((page - 1) * limit).limit(limit).exec();
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

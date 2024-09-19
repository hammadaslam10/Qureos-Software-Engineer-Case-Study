import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './schemas/task.schema';

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) { }

    @Get()
    async getTasks(
        @Query('page') page: number = 1, 
        @Query('limit') limit: number = 10, 
        @Query('sort') sort: 'asc' | 'desc' = 'asc', 
        @Query('priority') priority?: string, 
      
    ): Promise<{ tasks: Task[], totalPages: number }> {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        return this.taskService.getTasks(pageNumber, limitNumber, sort, priority);
    }

    @Post()
    async createTask(@Body() task: Partial<Task>): Promise<Task> {
        return this.taskService.createTask(task);
    }

    @Put(':id')
    async updateTask(@Param('id') id: string, @Body() task: Partial<Task>): Promise<Task> {
        return this.taskService.updateTask(id, task);
    }

    @Delete(':id')
    async archiveTask(@Param('id') id: string): Promise<void> {
        await this.taskService.archiveTask(id);
    }
}

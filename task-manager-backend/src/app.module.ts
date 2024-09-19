import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/task-manager'),
    TaskModule,
  ],
})
export class AppModule { }

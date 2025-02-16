import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './assignments.entity';
import { Employee } from 'src/employees/employees.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Employee])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService]
})
export class AssignmentsModule {}

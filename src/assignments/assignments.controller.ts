import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignEmployeesDto } from './dto/assign-employees.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}
  @Post('generate')
  async assignSanta(@Body() params: AssignEmployeesDto) {
    return await this.assignmentsService.assignSecretSanta(params);
  }

  @Get()
  async getAssignments(@Query('year') year: number) {
    return this.assignmentsService.getAssignmentsByYear(year);
  }

  @Get('export')
  async exportAssignments(@Query('year') year: number) {
    return this.assignmentsService.exportAssignmentsAsCsv(year);
  }
}

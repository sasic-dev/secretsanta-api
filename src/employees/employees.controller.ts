import { BadRequestException, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {

    constructor(private readonly employeesService: EmployeesService) { }

    @Post()
    async createEmployee(createEmployeeDto: CreateEmployeeDto) {
        return await this.employeesService.getAllEmployees();
    }

    @Get()
    async getEmployees() {
        return []
    }

    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    async importEmployees(@UploadedFile() file: Express.Multer.File) {
        if (!file || file.mimetype !== 'text/csv') {
            throw new BadRequestException('Please upload a valid CSV file');
        }
        return await this.employeesService.importFromCSV(file.buffer);
    }

    @Get('export')
    async exportEmployees() {
        return []
    }
}

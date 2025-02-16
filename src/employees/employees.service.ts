import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employees.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Readable } from 'stream';
import * as csvParser from 'csv-parser';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(params: CreateEmployeeDto): Promise<Employee> {
    try {
      const employee = this.employeeRepository.create(params);
      return await this.employeeRepository.save(employee);
    } catch (error) {
      throw new Error('Error creating employee');
    }
  }

  async getAllEmployees(): Promise<Employee[]> {
    try {
      return await this.employeeRepository.find();
    } catch (error) {
      throw new Error('Error getting all employees');
    }
  }

  async importFromCSV(fileBuffer: Buffer): Promise<Employee[]> {
    const employees: { [key: string]: string }[] = [];

    return new Promise((resolve, reject) => {
      const stream = Readable.from(fileBuffer.toString());

      stream
        .pipe(csvParser())
        .on('data', (data) => employees.push(data))
        .on('end', async () => {
          const employeesList = employees.map((employee) => ({
            name: employee.Employee_Name,
            email: employee.Employee_EmailID,
          }));
          if(employeesList.length === 0){ 
            throw new Error('No employees found in CSV');
          }
          const saveEmployees =
            await this.employeeRepository.save(employeesList);
          resolve(saveEmployees);
        })
        .on('error', (err) => reject(err));
    });
  }
}

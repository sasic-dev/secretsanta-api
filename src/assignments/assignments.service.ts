import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './assignments.entity';
import { In, Repository } from 'typeorm';
import { Employee } from 'src/employees/employees.entity';
import { AssignEmployeesDto } from './dto/assign-employees.dto';
import { format } from 'fast-csv';
import * as stream from 'stream';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
  ) {}
 
  async assignSecretSanta(dto: AssignEmployeesDto): Promise<Assignment[]> {
    const { year } = dto;
  
    // Fetch employees
    const employees = await this.employeeRepository.find();
    if (employees.length < 2) {
      throw new BadRequestException('At least two employees are required');
    }
    
    // Check if assignments for the year already exist
    const existingAssignments = await this.getAssignmentsByYear(year);
    if(existingAssignments.length > 0) {
      throw new BadRequestException(`Assignments for year ${year} already exist`);
    }

    // Fetch last two years' assignments with relations
    const pastAssignments = await this.assignmentRepository.find({
      where: { year: In([year - 1, year - 2]) },
      relations: ['employee', 'secretChild'], // Ensure relations are loaded
    });
  
    console.log('Past Assignments:', JSON.stringify(pastAssignments, null, 2));
  
    const shuffledEmployees = [...employees];
    for (let i = shuffledEmployees.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledEmployees[i], shuffledEmployees[j]] = [shuffledEmployees[j], shuffledEmployees[i]];
    }
  
    let assignments: Assignment[] = [];
  
    for (const element of employees) {
      const employee = element;
  
      // Ensure valid Secret Santa choices
      let availableRecipients = shuffledEmployees.filter(
        (e) =>
          e.id !== employee.id &&
          !pastAssignments.find(
            (a) =>
              a.employee?.id === employee.id &&
              a.secretChild?.id === e.id // Ensure secretChild is defined
          )
      );
  
      if (availableRecipients.length === 0) {
        throw new BadRequestException(`Could not find a valid Secret Santa for ${employee.name}`);
      }
  
      const secretChild = availableRecipients[0];
      shuffledEmployees.splice(shuffledEmployees.indexOf(secretChild), 1);
  
      assignments.push(
        this.assignmentRepository.create({
          employee,
          secretChild,
          year,
        })
      );
    }
  
    return this.assignmentRepository.save(assignments);
  }
    

  getAssignmentsByYear(year: number): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      relations: ['employee', 'secretChild'],
      where: {
        year,
      },
    });
  }

  getAllAssignments(): Promise<Assignment[]> {
    return this.assignmentRepository.find({ relations: ['giver', 'receiver'] });
  }

  async exportAssignmentsAsCsv(year: number) {
    const assignments = await this.getAssignmentsByYear(year);

    if (!assignments.length) {
      throw new BadRequestException(`No assignments found for year ${year}`);
    }

    const csvStream = format({
      headers: true,
      writeBOM: true
    });
    const bufferStream = new stream.PassThrough();

    csvStream.pipe(bufferStream)
    assignments.forEach((row, index) => csvStream.write({
      id: (index + 1),
      year: row.year,
      employee_name: row.employee.name,
      employee_email: row.employee.email,
      secret_child_name: row.secretChild.name,
      secret_child_email: row.secretChild.email
    }));
    csvStream.end();

    const csvBuffer = new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = []

        bufferStream.on('data', chunk => chunks.push(chunk))
        bufferStream.on('end', () => resolve(Buffer.concat(chunks)))
        bufferStream.on('error', err => reject(err))
    })

    return {
        success: true,
        message: 'Assignments exported successfully',
        data: (await csvBuffer).toString('base64'),
        fileType: 'text/csv',
        fileName: `assignments-${year}.csv`
    }
  }

}

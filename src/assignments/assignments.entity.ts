import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Employee } from '../employees/employees.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.assignments)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Employee, (employee) => employee.secretAssignments)
  @JoinColumn({ name: 'secret_child_id' })
  secretChild: Employee;

  @Column({ type: 'int', nullable: false})
  year: number
}

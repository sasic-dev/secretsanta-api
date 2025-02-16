import { Assignment } from "src/assignments/assignments.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Assignment, (assignment) => assignment.employee)
    assignments: Assignment[]

    @OneToMany(() => Assignment, (assignment) => assignment.secretChild)
    secretAssignments: Assignment[]
}
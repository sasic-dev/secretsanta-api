import { IsNumber, IsNotEmpty } from 'class-validator';

export class AssignEmployeesDto {
  @IsNumber()
  @IsNotEmpty()
  year: number;
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAssignmentTable1739473640580 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'assignments',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'employee_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'secret_child_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'year',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
        'assignments',
        new TableForeignKey({
            name: 'FK_assignment_employee_id',
            columnNames: ['employee_id'],
            referencedTableName: 'employees',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        })
    )

    await queryRunner.createForeignKey(
        'assignments',
        new TableForeignKey({
            name: 'FK_assignment_secret_child_id',
            columnNames: ['secret_child_id'],
            referencedTableName: 'employees',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('assignments', 'FK_assignment_employee_id');
    await queryRunner.dropForeignKey('assignments', 'FK_assignment_secret_child_id');

    await queryRunner.dropTable('assignments');
  }
}

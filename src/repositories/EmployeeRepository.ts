import { Inject, Service } from "typedi";
import { BaseOrmRepository } from "./BaseOrmRepository";
import { Logger } from "@Decorators/Logger";
import winston from "winston";
import { DataSource, DeepPartial } from "typeorm";
import { Employee } from "databases/postgres/entities/Employee";


@Service()
export class EmployeeRepository extends BaseOrmRepository<Employee> {
  constructor(
    @Logger(module) private logger: winston.Logger,
    @Inject('dataSource') private dataSource: DataSource,
  ) {
    super(dataSource, Employee);
  }

  async create(employee: DeepPartial<Employee>): Promise<Employee> {
    return this.repo.save(employee);
  }

  async getById(employeeId: number): Promise<Employee | null> {
    return this.repo.findOneBy({ employeeId: employeeId });
  }

  async search(filters: { employeeName?: string; phone?: string}): Promise<Employee[]> {
   const query = this.repo.createQueryBuilder('Employee');

    if (filters.employeeName) {
      query.andWhere('LOWER(Employee.EmployeeName) LIKE LOWER(:employeeName)', {
        employeeName: `%${filters.employeeName}%`,
      });
    }
    if (filters.phone) {
      query.andWhere('LOWER(Employee.Phone) LIKE LOWER(:phone)', {
        phone: `%${filters.phone}%`,
      });
    }

    return query.getMany();
  }

  async partialUpdate(id: number, data: DeepPartial<Employee>): Promise<Employee | null> {
    await this.repo.update(id, data);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async isEmailOrPhoneExist( phone: string): Promise<boolean> {
    const existingEmployee = await this.repo
      .createQueryBuilder('Employee')
      .where('Employee.Phone = :phone', { phone })
      .getOne();
    return !!existingEmployee;
  }
  
  async isEmailOrPhoneExistForOtherEmployee(employeeId: number, phone: string): Promise<boolean> {
    const existingEmployee = await this.repo
      .createQueryBuilder('Employee')
      .where('(Employee.Phone = :phone) AND Employee.EmployeeId != :employeeId', {
        phone,
        employeeId,
      })
      .getOne();
    return !!existingEmployee;
  }
}

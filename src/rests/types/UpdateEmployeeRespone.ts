import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UpdateEmployeeResponse {
  @Expose()
  employeeId: number;

  @Expose()
  employeeCode: string;

  @Expose()
  employeeName: string;

  @Expose()
  gender: string;

  @Expose()
  birthDate: Date;

  @Expose()
  phone: string;

  @Expose()
  address: string;

  @Expose()
  accountId: number;

  @Expose()
  status: string;
}

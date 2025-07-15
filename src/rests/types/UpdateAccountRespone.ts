import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UpdateAccountResponse {
  @Expose()
  accountId: number;

  @Expose()
  username: string;

  @Expose()
  role: string;

  @Expose()
  status: string;

  @Expose()
  password: string;
}

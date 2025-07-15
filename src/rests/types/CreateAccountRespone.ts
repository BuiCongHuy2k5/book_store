import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class CreateAccountResponse {
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

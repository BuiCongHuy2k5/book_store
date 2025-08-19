import { UserRole } from '@Enums/RestRoles';

export class CreateAccountInput {
  userName: string;
  passWord: string;
  role: UserRole;
}

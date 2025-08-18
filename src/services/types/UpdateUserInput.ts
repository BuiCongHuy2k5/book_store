import { RestRoles } from '@Enums/RestRoles';

export class UpdateUserInput {
  id: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  userName?: string;
  genDer?: RestRoles;
  birtDate?: Date;
  passWord?: string;
}

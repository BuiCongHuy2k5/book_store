import { Role } from "@Enums/RestRoles";

export class CreateAccountInput {
  username: string;
  password: string;
  role: string;
}

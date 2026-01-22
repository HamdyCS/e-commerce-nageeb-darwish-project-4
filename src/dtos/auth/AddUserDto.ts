import { Role } from "./Role";

export default interface AddUserDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}

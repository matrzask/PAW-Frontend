import { Gender } from '../enums/gender.enum';
import { UserRole } from '../enums/user-role.enum';

export interface User {
  id?: string;
  email: string;
  name: string;
  age: number;
  gender: Gender;
  role: UserRole;
  banned: boolean;
}

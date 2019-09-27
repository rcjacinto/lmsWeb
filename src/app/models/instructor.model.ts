import { User } from './user.model';

export interface Instructor extends User {
  employee_number: string;
}

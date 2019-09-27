import { User } from './user.model';

export interface Student extends User {
  student_number: string;
}

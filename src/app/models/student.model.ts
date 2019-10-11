import { User } from './user.model';
import { Class } from './class.model';

export interface Student extends User {
  student_number: string;
  course: string;
  classes: Class[];
}

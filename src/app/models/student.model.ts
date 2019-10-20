import { User } from './user.model';
import { Class } from './class.model';
import { Parent } from './parent.model';

export interface Student extends User {
  student_number: string;
  course: string;
  classes: Class[];
  parents: Parent[];
}

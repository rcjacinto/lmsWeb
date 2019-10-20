import { Student } from './student.model';
import { User } from './user.model';

export interface Parent extends User {
  student: string[];
}

import { Student } from './student.model';

export interface Parent {
  id?: string;
  email: string;
  name: string;
  student: Student;
  role?: string;
}

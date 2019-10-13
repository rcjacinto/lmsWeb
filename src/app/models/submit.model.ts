import { Activity } from './activity.model';
import { Student } from './student.model';

export interface Submit {
  id?: string;
  status: number;
  activity: Activity;
  date: {
    started: Date;
    modified: Date;
    submitted: any;
  };
  student: Student;
  timer_left: number;
  score?: number;
  total_items: number;
}

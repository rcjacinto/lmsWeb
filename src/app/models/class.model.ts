import { Student } from './student.model';

export interface Class {
  id?: string;
  name: string;
  description: string;
  color: string;
  date: {
    created: Date;
    modified: Date;
  };
  code: string;
  instructor: {
    id: string;
    name: string;
  };
  members: string[];
}

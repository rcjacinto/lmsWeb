import { Question } from './question.model';

export interface Activity {
  id?: string;
  term: string;
  title: string;
  instruction: string;
  time_limit: number;
  questions: Question[];
  class: {
    id: string;
    name: string;
  };
  instructor: {
    id: string;
    name: string;
  };
  date: {
    created: Date;
    modified: Date;
  };
  deadline?: Date;
  submits?: any[];
}

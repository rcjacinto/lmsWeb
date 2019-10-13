import { Question } from './question.model';

export interface Activity {
  id?: string;
  term: string;
  title: string;
  type: string;
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
  deadline?: any;
  submits?: any[];
  status: number;
}

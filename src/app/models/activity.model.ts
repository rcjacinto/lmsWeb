import { Question } from './question.model';

export interface Activity {
  id?: string;
  term: string;
  title: string;
  instruction: string;
  time_limit: number;
  questions: Question[];
  instructor: {
    name: string;
    id: string;
  };
  date: {
    created: Date;
    modified: Date;
  };
}

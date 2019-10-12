import { ExamActions, ExamActionTypes } from './exam.action';
import { Activity } from 'src/app/models/activity.model';

export const actInitialState: Activity = {
  id: '',
  class: {
    id: '',
    name: ''
  },
  instruction: '',
  instructor: {
    id: '',
    name: ''
  },
  questions: [],
  status: 0,
  term: '',
  time_limit: 0,
  title: '',
  type: '',
  date: {
    created: new Date(),
    modified: new Date()
  }
};

export function reducer(
  state = actInitialState,
  action: ExamActions
): Activity {
  switch (action.type) {
    case ExamActionTypes.SetExam:
      state = action.payload;
      return state;
    case ExamActionTypes.RemoveExam:
      state = actInitialState;
      return state;
    default:
      return state;
  }
}

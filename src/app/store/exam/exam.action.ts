import { Action } from '@ngrx/store';
import { Activity } from 'src/app/models/activity.model';

export enum ExamActionTypes {
  SetExam = '[Exam] Set Exam',
  RemoveExam = '[Exam] Remove Exam'
}

export class SetExam implements Action {
  readonly type = ExamActionTypes.SetExam;
  constructor(public payload: Activity) {}
}

export class RemoveExam implements Action {
  readonly type = ExamActionTypes.RemoveExam;
  constructor() {}
}

export type ExamActions = SetExam | RemoveExam;

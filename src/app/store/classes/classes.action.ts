import { Action } from '@ngrx/store';
import { Class } from 'src/app/models/class.model';

export enum ClassActionTypes {
  SetClass = '[Class] Set Class',
  RemoveClass = '[Class] Remove Class'
}

export class SetClass implements Action {
  readonly type = ClassActionTypes.SetClass;
  constructor(public payload: Class) {}
}

export class RemoveClass implements Action {
  readonly type = ClassActionTypes.RemoveClass;
  constructor() {}
}

export type ClassActions = SetClass | RemoveClass;

import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  ActionReducer
} from '@ngrx/store';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import * as fromUser from './user/user.reducer';
import * as fromClasses from './classes/classes.reducer';
import * as fromExam from './exam/exam.reducer';
import { User } from '../models/user.model';
import { Class } from '../models/class.model';
import { Activity } from '../models/activity.model';

export interface RootState {
  users: User;
  class: Class;
  exam: Activity;
}

export const reducers: ActionReducerMap<RootState> = {
  users: fromUser.reducer,
  class: fromClasses.reducer,
  exam: fromExam.reducer
};

export function storageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return storageSync<RootState>({
    features: [
      { stateKey: 'users' },
      { stateKey: 'class' },
      { stateKey: 'exam' }
    ],
    storage: window.localStorage
  })(reducer);
}

export const selectUserState = createFeatureSelector<User>('users');

export const selectUser = createSelector(
  selectUserState,
  state => state
);

export const selectEmail = createSelector(
  selectUser,
  user => user.email
);

export const selectRole = createSelector(
  selectUser,
  user => user.role
);

export const selectName = createSelector(
  selectUser,
  user => user.name
);

export const selectProfilePic = createSelector(
  selectUser,
  user => user.image
);

// classes

export const selectClassState = createFeatureSelector<Class>('class');
export const selectClass = createSelector(
  selectClassState,
  state => state
);

// exam

export const selectExamState = createFeatureSelector<Activity>('exam');
export const selectExam = createSelector(
  selectExamState,
  state => state
);

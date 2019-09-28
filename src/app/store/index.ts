import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  ActionReducer
} from '@ngrx/store';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import * as fromUser from './user/user.reducer';
import * as fromClasses from './classes/classes.reducer';
import { User } from '../models/user.model';
import { Class } from '../models/class.model';

export interface RootState {
  users: User;
  class: Class;
}

export const reducers: ActionReducerMap<RootState> = {
  users: fromUser.reducer,
  class: fromClasses.reducer
};

export function storageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return storageSync<RootState>({
    features: [{ stateKey: 'users' }, { stateKey: 'classs' }],
    storage: window.localStorage
  })(reducer);
}

export const selectUserState = createFeatureSelector<User>('users');
export const selectClassState = createFeatureSelector<Class>('class');

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
export const selectClass = createSelector(
  selectClassState,
  state => state
);
